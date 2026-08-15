# Civ VII Randomizer → In-Game Loadout Import

**Status:** approved design (user-directed: research → spec → implement)
**Date:** 2026-08-15

## Goal

Let a player copy the generated civ/leader assignment out of the web app and paste
it into Civilization VII so the game's setup screen adopts those selections. Two
deliverables:

1. **Export** — a "Copy Mod Code" action in `index.html` that serializes the last
   generated assignment to a compact one-line code and puts it on the clipboard.
2. **Import mod** — a Steam-Workshop-ready UI mod under `Mod/` that adds a paste
   box to the game's Create Game screen, parses the code, validates it, and applies
   it via the game's setup APIs.

## Research foundation (verified 2026-08-15)

- Civ VII UI is HTML/JS (Coherent Gameface). Mods extend it with shell-scope
  `<UIScripts>` in a `.modinfo`; scripts patch screen classes at runtime
  (`Controls.getDefinition(...)` + prototype extension). Confirmed against the
  installed game (`Base/modules/core`) and the published open-source mod
  "Copy Join Code" (BobobUnicorn).
- The live single-player setup screen is `ui-next/screens/create-game/`
  (`create-game-screen.js` et al.); the older `ui/shell/create-panels/*` files are
  dead code. Multiplayer staging (`ui/shell/mp-staging/`) is a separate, older
  architecture — **v1 targets single-player only**.
- Selections are applied through the parameter layer:
  `GameSetup.setPlayerParameterValue(playerId, "PlayerLeader", "LEADER_X")` then
  `"PlayerCivilization"`, `"CIVILIZATION_Y"` (order matters: civ domain is filtered
  by leader+age). Valid values come from
  `GameSetup.findPlayerParameter(id, "PlayerCivilization").domain.possibleValues`
  — validating against that lets configs referencing unowned DLC degrade
  gracefully. UI models poll `GameSetup.currentRevision` (~150 ms), so changes
  surface without extra plumbing.
- The game UI **cannot read the OS clipboard** (only `UI.setClipboardText` exists,
  confirmed by exhaustive grep of shipped JS). Import therefore uses an
  `fxs-textbox` (the shipped text-input component; OS Ctrl+V lands in its inner
  `<input>` — proven by the multiplayer join-code field).
- Steam Workshop upload happens via the **Steam Workshop Uploader** in the free
  official Modding SDK (Steam Tools app 3688890). Unit of upload = one folder with
  a `.modinfo` at its root. The uploader is stricter than the game: every file
  referenced must exist; XML tags must be exact-case-matched. UI-only mods are
  allowed and common; `AffectsSavedGames=0` lets players toggle mid-campaign.
- Internal IDs verified from the installed game's data/localization files:
  leaders `LEADER_<NAME>` with alternate personas as `LEADER_<NAME>_ALT`
  (ALT = World Conqueror Ashoka, High Shaman Himiko, Baroque Friedrich,
  Achaemenid Xerxes, **Revolutionary** Napoleon — base `LEADER_NAPOLEON` is the
  Emperor persona); Antiquity civs `CIVILIZATION_{AKSUM, ASSYRIA, CARTHAGE,
  EGYPT, GREECE, HAN, HEIAN, KHMER, MAURYA, MAYA, MISSISSIPPIAN, PERSIA, ROME,
  SILLA, TONGA}`.
- The live create-game screen is **SolidJS function components** (verified by
  reading `create-game-screen.js`), so there is no patchable class prototype.
  The mod injects DOM by observing for the `create-game-sp` element instead —
  also more resilient to game patches. Slot management pattern verified in
  `game-parameters-model.js`: `Configuration.editPlayer(id).setSlotStatus(...)`
  + `.setAsMajorCiv()`, slot cap = `Configuration.getMap().maxMajorPlayers`;
  `GameSetup`, `Configuration`, `GameContext`, `SlotStatus` are ambient globals
  in shell scope.

## The code format (contract between app and mod)

One line, ASCII, human-readable, versioned:

```
C7L1;ANTIQUITY;H:AMINA:ROME;A:XERXES_ALT:PERSIA;A:GENGHIS_KHAN:SILLA
```

- Field 0: magic + version, `C7L1`. Parsers reject anything else.
- Field 1: age token (`ANTIQUITY` for now; the app only assigns Antiquity civs).
- Fields 2..n: one per player, `ROLE:LEADER_TOKEN:CIV_TOKEN`, in generation order.
  `ROLE` is `H` (human) or `A` (AI). Tokens are the internal IDs minus their
  `LEADER_` / `CIVILIZATION_` prefixes; the mod re-adds prefixes.
- Whitespace around separators is tolerated; the mod uppercases tokens.

Rationale: compact enough for a single-line `fxs-textbox` (no `max-length`
surprises), eyeball-checkable, no JSON quoting issues, versioned for evolution.

## Export (index.html)

- New maps `leaderIds` (display name → token, personas → `_ALT` tokens) and
  `civIds` (civ display name → token) beside `leaderDict`/`civList`.
- `assignRoles()` records the last generated assignment in a module-level
  variable.
- After generation, the results section shows an **"Copy Mod Code"** button:
  builds the code, `navigator.clipboard.writeText` (fallback: select-on-focus
  readonly input), flashes "Copied".
- A short hint links to the mod's README for how to use the code in-game.

## Import mod (`Mod/ghostng-loadout-import/`)

```
Mod/
  ghostng-loadout-import/
    ghostng-loadout-import.modinfo
    ui/
      loadout-import.js      # screen hook + panel + apply logic
      loadout-parse.js       # pure parser/validator (no game APIs — testable)
      loadout-import.css
    README.md                # install + Workshop upload instructions
```

- `.modinfo`: shell-scope ActionGroup, `AlwaysMet` criteria, `UIScripts` for the
  JS, `ImportFiles` for the CSS, `LoadOrder` 100, `AffectsSavedGames=0`,
  dependency on `core`. Mod id `ghostng-loadout-import` (prefix convention, not
  reverse-DNS).
- `loadout-import.js`:
  - a `MutationObserver` on the document watches for the `create-game-sp`
    element (the SP setup screen host) and injects a collapsible "Randomizer
    Import" overlay panel into it: an `fxs-textbox` + Apply button + status
    line. No prototype patching — the SolidJS screen offers none.
  - On Apply: parse → validate every leader/civ against the live
    `GameSetup` domains (report unowned/unknown entries by name) → apply:
    - entry 1 (first `H`): local player (`GameContext.localPlayerID`).
    - remaining entries: AI slots — `Configuration.editPlayer(id)`
      `.setSlotStatus(SS_COMPUTER)` + `.setAsMajorCiv()` when the slot isn't
      already a participant, then parameter writes.
    - each slot: `PlayerLeader` first, `PlayerCivilization` second.
  - Status line reports applied/skipped counts; never throws into game code.
- Failure modes: bad magic → "not a randomizer code"; unknown token → listed and
  skipped; more players than max supported slots → extra entries reported and
  dropped.
- v1 scope: single-player Create Game screen only. MP staging is architecturally
  separate; documented as future work.

## Testing

- Parser (`loadout-parse.js`) is game-API-free and tested with Node.
- Export round-trip tested in the DOM simulation used for earlier features
  (generate → export code → parse with the mod's parser → compare).
- In-game behavior needs a manual pass (enable console/ReloadUI via
  `AppOptions.txt`; check `UI.log` for errors). **Known first-hour risk** from
  research: confirm OS paste lands in a mod-created `fxs-textbox` on this screen.
  Fallback if it doesn't: chunked entry or file-drop investigation.

## Steam Workshop publishing (user-performed)

1. Install "Sid Meier's Civilization VII Development Tools" (Steam → Library →
   Tools).
2. Copy `Mod/ghostng-loadout-import/` into
   `%LOCALAPPDATA%\Firaxis Games\Sid Meier's Civilization VII\Mods\` and verify
   in-game first.
3. Run the Steam Workshop Uploader from the SDK, point it at the mod folder,
   add preview image + tags (`UI`, `Game Setup`), accept the Workshop legal
   agreement on first upload.
4. Recommended: also publish the zipped folder to CivFanatics Downloads (feeds
   CivMods + non-Steam players).
