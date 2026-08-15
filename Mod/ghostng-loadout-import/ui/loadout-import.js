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
import { parseLoadoutCode } from "/ghostng-loadout-import/ui/loadout-parse.js";

const PANEL_ID = "ghostng-loadout-import-panel";
const CSS_URL = "fs://game/ghostng-loadout-import/ui/loadout-import.css";

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
    return values.some(v => valueToString(v.value) === id && (v.invalidReason === undefined || v.invalidReason === "Valid" || v.invalidReason === 0));
}

function setSlotAsParticipant(playerId, isHuman) {
    const config = Configuration.getPlayer(playerId);
    const wantedStatus = isHuman ? SlotStatus.SS_TAKEN : SlotStatus.SS_COMPUTER;
    if (config.slotStatus !== wantedStatus) {
        const edit = Configuration.editPlayer(playerId);
        if (edit) {
            // Local player slot is already taken; only flip open/closed slots to AI.
            if (!isHuman) {
                edit.setSlotStatus(SlotStatus.SS_COMPUTER);
            }
            edit.setAsMajorCiv();
        }
    }
}

function applyLoadout(code) {
    const parsed = parseLoadoutCode(code);
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

    let applied = 0;
    const skipped = [];
    for (const { playerId, entry, isHuman } of assignments) {
        setSlotAsParticipant(playerId, isHuman);

        // Leader first: the civ domain is filtered by the current leader + age.
        const leaderParam = GameSetup.findPlayerParameter(playerId, "PlayerLeader");
        if (!domainContains(leaderParam, entry.leader)) {
            skipped.push(`${entry.leader} (not available — DLC not owned or invalid)`);
            continue;
        }
        GameSetup.setPlayerParameterValue(playerId, "PlayerLeader", entry.leader);

        const civParam = GameSetup.findPlayerParameter(playerId, "PlayerCivilization");
        if (!domainContains(civParam, entry.civ)) {
            skipped.push(`${entry.civ} (not available for ${entry.leader})`);
            // Leave the slot on its leader with a random civ rather than half-undoing.
            GameSetup.setPlayerParameterValue(playerId, "PlayerCivilization", "RANDOM");
            continue;
        }
        GameSetup.setPlayerParameterValue(playerId, "PlayerCivilization", entry.civ);
        applied++;
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
    if (skipped.length > 0) {
        message += ` Skipped: ${skipped.join(", ")}.`;
    }
    if (notes.length > 0) {
        message += ` ${notes.join(" ")}`;
    }
    return { ok: true, message };
}

function buildPanel() {
    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.classList.add("loadout-import", "loadout-import--collapsed");
    panel.innerHTML = `
        <div class="loadout-import__tab" role="button" tabindex="-1">Import Loadout</div>
        <div class="loadout-import__body">
            <div class="loadout-import__title">Civ7 Randomizer</div>
            <div class="loadout-import__hint">Paste your loadout code (Ctrl+V), then Apply.</div>
            <fxs-textbox class="loadout-import__input" placeholder="C7L1;ANTIQUITY;H:AMINA:ROME;..."></fxs-textbox>
            <div class="loadout-import__apply" role="button" tabindex="-1">Apply</div>
            <div class="loadout-import__status"></div>
        </div>`;

    const tab = panel.querySelector(".loadout-import__tab");
    const applyBtn = panel.querySelector(".loadout-import__apply");
    const status = panel.querySelector(".loadout-import__status");
    const textbox = panel.querySelector(".loadout-import__input");

    tab.addEventListener("click", () => {
        panel.classList.toggle("loadout-import--collapsed");
    });

    const runApply = () => {
        try {
            const value = textbox.value ?? textbox.getAttribute("value") ?? "";
            const result = applyLoadout(value);
            status.textContent = result.message;
            status.classList.toggle("loadout-import__status--error", !result.ok);
        } catch (err) {
            console.error("loadout-import: apply failed", err);
            status.textContent = "Something went wrong applying the code — see UI.log.";
            status.classList.add("loadout-import__status--error");
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

function watchForCreateGameScreen() {
    const existing = document.querySelector("create-game-sp");
    if (existing) {
        injectInto(existing);
    }
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }
                const host = node.matches?.("create-game-sp") ? node : node.querySelector?.("create-game-sp");
                if (host) {
                    injectInto(host);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

engine.whenReady.then(watchForCreateGameScreen);
