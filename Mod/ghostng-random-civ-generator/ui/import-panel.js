/**
 * Ghosts Random Civ Generator — shell UI script.
 *
 * Adds an "Import Code" panel to the multiplayer lobby (screen-mp-lobby),
 * where civs and leaders are configured. Every player pastes the same
 * generator code:
 *   - Each human applies the H entry matching their seat order among human
 *     players (1st human in the lobby = 1st H entry = "Player 1" in the app).
 *   - The host additionally applies the A entries to AI slots.
 * Selections are written through the GameSetup parameter layer — the same
 * path the lobby's own dropdowns use — so they replicate to all clients.
 *
 * The OS clipboard is not readable from the game UI, so the user pastes
 * (Ctrl+V) into an fxs-textbox and clicks Apply.
 */
import { parseGeneratorCode } from "/ghostng-random-civ-generator/ui/import-parse.js";

const PANEL_ID = "ghostng-random-civ-generator-panel";
const CSS_URL = "fs://game/ghostng-random-civ-generator/ui/import-panel.css";

function ensureStylesheet() {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CSS_URL;
        document.head.appendChild(link);
    }
}

/** Resolve a domain possible-value to a plain string id (values may be interned handles). */
function valueToString(value) {
    if (typeof value === "number") {
        return GameSetup.resolveString(value) ?? "";
    }
    return String(value ?? "");
}

function domainContains(parameter, id) {
    const values = parameter?.domain?.possibleValues;
    if (!values) {
        return false; // no domain info — treat as unavailable rather than guessing
    }
    // invalidReason carries the engine's GameSetupDomainValueInvalidReason enum;
    // compare against it like shipped setup code does. If the enum global is
    // somehow absent, accept rather than reject everything.
    const validReason = typeof GameSetupDomainValueInvalidReason !== "undefined"
        ? GameSetupDomainValueInvalidReason.Valid
        : undefined;
    return values.some(v => valueToString(v.value) === id
        && (validReason === undefined || v.invalidReason == validReason));
}

/** Strip the internal prefix for human-readable status messages. */
function pretty(id) {
    return id.replace(/^LEADER_|^CIVILIZATION_/, "").replace(/_/g, " ");
}

/**
 * Write one entry's leader+civ to a slot. Leader first — the civ domain is
 * filtered by leader + age. Content missing from this game (unowned DLC,
 * unknown/future IDs) falls back to RANDOM. Returns names that were missing.
 */
function applyEntryToSlot(playerId, entry) {
    const missing = [];

    const leaderParam = GameSetup.findPlayerParameter(playerId, "PlayerLeader");
    const leaderOk = domainContains(leaderParam, entry.leader);
    GameSetup.setPlayerParameterValue(playerId, "PlayerLeader", leaderOk ? entry.leader : "RANDOM");
    if (!leaderOk) {
        missing.push(pretty(entry.leader));
    }

    const civParam = GameSetup.findPlayerParameter(playerId, "PlayerCivilization");
    const civOk = domainContains(civParam, entry.civ);
    GameSetup.setPlayerParameterValue(playerId, "PlayerCivilization", civOk ? entry.civ : "RANDOM");
    if (!civOk) {
        missing.push(pretty(entry.civ));
    }

    return missing;
}

function applyGeneratorCode(code) {
    const parsed = parseGeneratorCode(code);
    if (!parsed.ok) {
        return { ok: false, message: parsed.error };
    }

    const localId = GameContext.localPlayerID;
    const isHost = Network.getHostPlayerId() === localId;
    const maxPlayers = Configuration.getMap().maxMajorPlayers;
    const notes = [];
    const missing = [];

    // Age is a game parameter — host-owned. Only touch it when it differs.
    if (isHost) {
        const ageParam = GameSetup.findGameParameter("Age");
        if (ageParam) {
            const currentAge = valueToString(ageParam.value?.value ?? ageParam.value);
            if (currentAge !== parsed.age) {
                GameSetup.setGameParameterValue("Age", parsed.age);
                notes.push(`Age set to ${parsed.age}.`);
            }
        }
    }

    // Seat order: nth human in the lobby (ascending playerId) takes the nth
    // H entry — "Player 1" in the web app is the first human seat (the host).
    const humanIds = [];
    const aiIds = [];
    const openIds = [];
    for (let id = 0; id < maxPlayers; id++) {
        const config = Configuration.getPlayer(id);
        if (config.isParticipant && config.isHuman) {
            humanIds.push(id);
        } else if (config.slotStatus === SlotStatus.SS_COMPUTER) {
            aiIds.push(id);
        } else if (config.slotStatus === SlotStatus.SS_OPEN || config.slotStatus === SlotStatus.SS_CLOSED) {
            openIds.push(id);
        }
    }

    const hEntries = parsed.players.filter(p => p.role === "H");
    const aEntries = parsed.players.filter(p => p.role === "A");

    // Apply the local player's own row.
    const seat = humanIds.indexOf(localId);
    if (seat === -1) {
        return { ok: false, message: "Couldn't find your player slot in this lobby." };
    }
    if (seat >= hEntries.length) {
        notes.push(`The code has ${hEntries.length} human row${hEntries.length === 1 ? "" : "s"} but you are human #${seat + 1} — your picks stay unchanged.`);
    } else {
        const entry = hEntries[seat];
        missing.push(...applyEntryToSlot(localId, entry));
        notes.push(`You are human #${seat + 1}: ${pretty(entry.leader)} / ${pretty(entry.civ)}.`);
    }

    // Host also applies AI rows, growing/shrinking AI slots to match the code.
    if (isHost) {
        let applied = 0;
        for (const entry of aEntries) {
            let slotId = aiIds.shift();
            if (slotId === undefined) {
                slotId = openIds.shift();
                if (slotId === undefined) {
                    notes.push(`Dropped AI row ${pretty(entry.leader)} / ${pretty(entry.civ)}: no free slots.`);
                    continue;
                }
                const edit = Configuration.editPlayer(slotId);
                if (edit) {
                    edit.setSlotStatus(SlotStatus.SS_COMPUTER);
                    edit.setAsMajorCiv();
                }
            }
            missing.push(...applyEntryToSlot(slotId, entry));
            applied++;
        }
        // Close surplus AI slots so the lobby matches the code exactly.
        for (const surplusId of aiIds) {
            Configuration.editPlayer(surplusId)?.setSlotStatus(SlotStatus.SS_CLOSED);
        }
        notes.push(`Applied ${applied} AI slot${applied === 1 ? "" : "s"}.`);
    } else if (aEntries.length > 0) {
        notes.push("AI rows are applied by the host — have them paste the code too.");
    }

    let message = notes.join(" ");
    if (missing.length > 0) {
        message += ` Not in your game, randomized instead: ${missing.join(", ")}.`;
    }
    return { ok: true, message };
}

function buildPanel() {
    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.classList.add("civgen", "civgen--collapsed");
    panel.innerHTML = `
        <div class="civgen__tab" role="button" tabindex="-1">Import Code</div>
        <div class="civgen__body">
            <div class="civgen__title">Ghosts Random Civ Generator</div>
            <div class="civgen__hint">Paste your generator code (Ctrl+V), then Apply. Every player pastes the same code.</div>
            <fxs-textbox class="civgen__input" enabled="true" placeholder="C7L1;ANTIQUITY;H:AMINA:ROME;..."></fxs-textbox>
            <div class="civgen__apply" role="button" tabindex="-1">Apply</div>
            <div class="civgen__status"></div>
        </div>`;

    const tab = panel.querySelector(".civgen__tab");
    const applyBtn = panel.querySelector(".civgen__apply");
    const status = panel.querySelector(".civgen__status");
    const textbox = panel.querySelector(".civgen__input");

    tab.addEventListener("click", () => {
        panel.classList.toggle("civgen--collapsed");
    });

    const runApply = () => {
        try {
            const value = textbox.value ?? textbox.getAttribute("value") ?? "";
            const result = applyGeneratorCode(value);
            status.textContent = result.message;
            status.classList.toggle("civgen__status--error", !result.ok);
        } catch (err) {
            console.error("civgen: apply failed", err);
            status.textContent = "Something went wrong applying the code — see UI.log.";
            status.classList.add("civgen__status--error");
        }
    };
    applyBtn.addEventListener("click", runApply);
    textbox.addEventListener("text-edit-stop", (ev) => {
        if (ev.detail?.confirmed) {
            runApply();
        }
    });

    return panel;
}

function injectInto(host) {
    if (host.querySelector(`#${PANEL_ID}`)) {
        return;
    }
    ensureStylesheet();
    host.appendChild(buildPanel());
}

/**
 * Official decorator hook: the framework constructs registered decorators when
 * the named component initializes (component-support.js) and drives the
 * lifecycle methods below. "screen-mp-lobby" is the multiplayer lobby, where
 * players configure their civ/leader. Same pattern as bz's published UI mods.
 */
class ImportPanelDecorator {
    constructor(component) {
        this.component = component;
        this.Root = component.Root;
    }
    beforeAttach() { }
    afterAttach() {
        try {
            injectInto(this.Root);
        } catch (err) {
            console.error("civgen: failed to inject panel", err);
        }
    }
    beforeDetach() {
        // Backing out of the lobby must take the panel with it — screen
        // elements can be kept around for reuse, so remove explicitly.
        this.Root.querySelector(`#${PANEL_ID}`)?.remove();
    }
    afterDetach() { }
    onAttributeChanged(_name, _prev, _next) { }
}

engine.whenReady.then(() => {
    Controls.decorate("screen-mp-lobby", (component) => new ImportPanelDecorator(component));
});
