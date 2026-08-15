/**
 * Parser for Civ7 Randomizer generator codes. Pure module — no game APIs — so it
 * can be unit-tested outside the game.
 *
 * Format (one line):
 *   C7L1;ANTIQUITY;H:AMINA:ROME;A:XERXES_ALT:PERSIA
 *
 * Field 0  magic + version ("C7L1")
 * Field 1  age token (ANTIQUITY | EXPLORATION | MODERN)
 * Field 2+ one per player: ROLE:LEADER_TOKEN:CIV_TOKEN
 *          ROLE is H (human) or A (AI). Tokens are internal IDs without their
 *          LEADER_ / CIVILIZATION_ prefixes.
 */

export const CODE_MAGIC = "C7L1";
const AGES = ["ANTIQUITY", "EXPLORATION", "MODERN"];
const TOKEN_RE = /^[A-Z0-9_]+$/;

/**
 * @param {string} text raw pasted text
 * @returns {{ok: true, age: string, players: {role: 'H'|'A', leader: string, civ: string}[]}
 *         | {ok: false, error: string}}
 */
export function parseGeneratorCode(text) {
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
        return { ok: false, error: "Empty code. Paste a code from the Civ7 Randomizer web app." };
    }

    const fields = trimmed.split(";").map(f => f.trim()).filter(f => f.length > 0);
    if (fields[0]?.toUpperCase() !== CODE_MAGIC) {
        return { ok: false, error: "Not a Civ7 Randomizer code (expected it to start with " + CODE_MAGIC + ")." };
    }

    const age = (fields[1] ?? "").toUpperCase();
    if (!AGES.includes(age)) {
        return { ok: false, error: "Unknown age \"" + fields[1] + "\"." };
    }

    const players = [];
    for (const field of fields.slice(2)) {
        const parts = field.split(":").map(p => p.trim().toUpperCase());
        if (parts.length !== 3) {
            return { ok: false, error: "Bad player entry \"" + field + "\" (expected ROLE:LEADER:CIV)." };
        }
        const [role, leader, civ] = parts;
        if (role !== "H" && role !== "A") {
            return { ok: false, error: "Bad role \"" + role + "\" in \"" + field + "\" (expected H or A)." };
        }
        if (!TOKEN_RE.test(leader) || !TOKEN_RE.test(civ)) {
            return { ok: false, error: "Bad leader/civ token in \"" + field + "\"." };
        }
        players.push({ role, leader: "LEADER_" + leader, civ: "CIVILIZATION_" + civ });
    }

    if (players.length === 0) {
        return { ok: false, error: "The code contains no players." };
    }
    if (players.filter(p => p.role === "H").length === 0) {
        return { ok: false, error: "The code contains no human player." };
    }

    return { ok: true, age: "AGE_" + age, players };
}
