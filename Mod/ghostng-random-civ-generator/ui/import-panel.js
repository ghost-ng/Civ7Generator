/**
 * Randomizer Loadout Import — shell UI script.
 *
 * Watches for the single-player Create Game screen (the <create-game-sp>
 * element) and injects a small overlay panel with a paste box. Applying a code
 * writes selections through the GameSetup parameter layer, the same path the
 * game's own setup screens use, so the UI models (which poll
 * GameSetup.currentRevision) pick the changes up on their own.
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

function setSlotAsParticipant(playerId, isHuman) {
    // Match the engine idiom (game-parameters-model.js): setSlotStatus and
    // setAsMajorCiv are always paired. The local player's slot is already
    // taken, so only AI slots get a status change.
    const edit = Configuration.editPlayer(playerId);
    if (edit) {
        if (!isHuman) {
            edit.setSlotStatus(SlotStatus.SS_COMPUTER);
        }
        edit.setAsMajorCiv();
    }
}

function applyGeneratorCode(code) {
    const parsed = parseGeneratorCode(code);
    if (!parsed.ok) {
        return { ok: false, message: parsed.error };
    }

    const notes = [];

    // Age: set only if it differs, so we don't churn the setup needlessly.
    const ageParam = GameSetup.findGameParameter("Age");
    if (ageParam) {
        const currentAge = valueToString(ageParam.value?.value ?? ageParam.value);
        if (currentAge !== parsed.age) {
            GameSetup.setGameParameterValue("Age", parsed.age);
            notes.push(`Age set to ${parsed.age}.`);
        }
    }

    const localId = GameContext.localPlayerID;
    const maxPlayers = Configuration.getMap().maxMajorPlayers;

    // Order the config: first human entry -> local player slot, everything else
    // (extra humans become AI in single player) -> other slots in order.
    const entries = [...parsed.players];
    const firstHumanIdx = entries.findIndex(p => p.role === "H");
    const [localEntry] = entries.splice(firstHumanIdx, 1);

    const assignments = [{ playerId: localId, entry: localEntry, isHuman: true }];
    let nextId = 0;
    for (const entry of entries) {
        while (nextId === localId || assignments.some(a => a.playerId === nextId)) {
            nextId++;
        }
        if (nextId >= maxPlayers) {
            notes.push(`Dropped ${entry.leader} / ${entry.civ}: map supports ${maxPlayers} players.`);
            continue;
        }
        assignments.push({ playerId: nextId, entry, isHuman: false });
    }

    // Strip the internal prefix for human-readable status messages.
    const pretty = (id) => id.replace(/^LEADER_|^CIVILIZATION_/, "").replace(/_/g, " ");

    let applied = 0;
    const randomized = [];
    for (const { playerId, entry, isHuman } of assignments) {
        setSlotAsParticipant(playerId, isHuman);

        // Leader first: the civ domain is filtered by the current leader + age.
        // Content missing from this game (unowned DLC, unknown/future IDs)
        // falls back to RANDOM so the slot layout still matches the code.
        const leaderParam = GameSetup.findPlayerParameter(playerId, "PlayerLeader");
        const leaderOk = domainContains(leaderParam, entry.leader);
        GameSetup.setPlayerParameterValue(playerId, "PlayerLeader", leaderOk ? entry.leader : "RANDOM");
        if (!leaderOk) {
            randomized.push(pretty(entry.leader));
        }

        const civParam = GameSetup.findPlayerParameter(playerId, "PlayerCivilization");
        const civOk = domainContains(civParam, entry.civ);
        GameSetup.setPlayerParameterValue(playerId, "PlayerCivilization", civOk ? entry.civ : "RANDOM");
        if (!civOk) {
            randomized.push(pretty(entry.civ));
        }

        if (leaderOk && civOk) {
            applied++;
        }
    }

    // Close surplus AI slots so the game matches the pasted config exactly.
    const usedIds = new Set(assignments.map(a => a.playerId));
    for (let id = 0; id < maxPlayers; id++) {
        if (usedIds.has(id) || id === localId) {
            continue;
        }
        const config = Configuration.getPlayer(id);
        if (config.slotStatus === SlotStatus.SS_COMPUTER) {
            const edit = Configuration.editPlayer(id);
            edit?.setSlotStatus(SlotStatus.SS_CLOSED);
        }
    }

    let message = `Applied ${applied}/${parsed.players.length} picks.`;
    if (randomized.length > 0) {
        message += ` Not in your game, randomized instead: ${randomized.join(", ")}.`;
    }
    if (notes.length > 0) {
        message += ` ${notes.join(" ")}`;
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
            <div class="civgen__hint">Paste your generator code (Ctrl+V), then Apply.</div>
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
 * lifecycle methods below. "create-game-sp" is the SP Create Game screen host
 * (registered via defineLegacyComponent -> Controls.define). Same pattern as
 * bz's published UI mods.
 */
class LoadoutImportDecorator {
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
    beforeDetach() { }
    afterDetach() { }
    onAttributeChanged(_name, _prev, _next) { }
}

engine.whenReady.then(() => {
    Controls.decorate("create-game-sp", (component) => new LoadoutImportDecorator(component));
});
