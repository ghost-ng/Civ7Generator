# Ghosts Random Civ Generator (Mod)

A Civilization VII UI mod that applies a loadout code from the
[Civ7 Randomizer web app](https://ghost-ng.github.io/Civ7Generator/) to the
Create Game screen: your civ + leader, the AI players' civs + leaders, and the
AI player count, all from one pasted line.

## Using it

1. Generate an assignment in the web app and click **Copy Mod Code**.
2. In Civ VII, start **Create Game** (single player).
3. Click the **Import Loadout** tab in the bottom-right corner.
4. Paste the code (Ctrl+V) into the box and press **Apply** (or Enter).

The panel reports what was applied. Entries referencing DLC you don't own are
skipped by name; everything else still applies.

## Installing locally (for testing)

Copy this whole folder (`ghostng-random-civ-generator/`) into:

- Windows: `%LOCALAPPDATA%\Firaxis Games\Sid Meier's Civilization VII\Mods\`
- macOS: `~/Library/Application Support/Civilization VII/Mods/`
- Linux/Steam Deck: `~/My Games/Sid Meier's Civilization VII/Mods/`

Then enable it in-game under **Additional Content → Mods**. It's UI-only
(`AffectsSavedGames=0`), so it can be toggled freely without invalidating saves.

Dev loop: enable the in-game console in `AppOptions.txt` (next to the `Mods`
folder) to get a **ReloadUI** button — JS/CSS changes reload in about a second.
Errors land in `Logs\UI.log`.

## Publishing to Steam Workshop

1. In Steam, enable the **Tools** category filter in your Library and install
   **Sid Meier's Civilization VII Development Tools** (free).
2. Verify the mod works locally first (above).
3. Launch the **Steam Workshop Uploader** from the Development Tools and point
   it at this folder. Suggested tags: `UI`, `Game Setup`. Add a preview image
   (JPG/PNG, keep it under 1 MB).
4. First upload: accept the Steam Workshop legal agreement on the item's page,
   then flip visibility from hidden to public.

The uploader is stricter than the game: every file referenced in the
`.modinfo` must exist on disk and XML tags must match case exactly. This mod's
`.modinfo` lists `ui/loadout-import.js`, `ui/loadout-parse.js`, and
`ui/loadout-import.css` — keep those paths intact.

Recommended: also publish a zip of this folder to CivFanatics Downloads
(Civ 7 - UI Mods category) — that's what the CivMods manager indexes, and it
reaches non-Steam players.

## Code format

```
C7L1;ANTIQUITY;H:AMINA:ROME;A:XERXES_ALT:PERSIA;A:GENGHIS_KHAN:SILLA
```

`C7L1` = format version. Then the age, then one `ROLE:LEADER:CIV` entry per
player (`H` human, `A` AI). Leader/civ tokens are the game's internal IDs
without the `LEADER_` / `CIVILIZATION_` prefixes; alternate personas use the
`_ALT` suffix (e.g. `NAPOLEON_ALT` = Napoleon, Revolutionary).

## Scope

Single-player Create Game screen only. The multiplayer lobby uses a separate,
older UI architecture; multiplayer support would be a follow-up.
