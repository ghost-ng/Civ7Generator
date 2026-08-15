# Ghosts Random Civ Generator (Mod)

A Civilization VII UI mod that applies a generator code from the
[Ghosts Random Civ Generator web app](https://ghost-ng.github.io/Civ7Generator/)
to the multiplayer lobby: each player's civ + leader, the AI players' civs +
leaders, and the AI player count, all from one pasted line.

## Using it

1. Generate an assignment in the web app and click **Copy Mod Code**.
2. In Civ VII, create or join a **multiplayer lobby** (everyone needs the mod
   enabled).
3. Click the **Import Code** tab in the bottom-left corner of the lobby.
4. **Every player pastes the same code** (Ctrl+V) and presses **Apply** (or
   Enter).

Seat order maps to the code: the 1st human in the lobby (the host) gets the
web app's Player 1 row, the 2nd human gets Player 2, and so on. The host's
Apply also sets up the AI slots — adding or closing AI slots so the lobby
matches the code.

The panel reports what was applied. Leaders or civs that aren't in your game
(unowned DLC, newer content than your game version) are randomized instead and
listed by name.

## Installing

Copy this whole folder (`ghostng-random-civ-generator/`) into:

- Windows: `%LOCALAPPDATA%\Firaxis Games\Sid Meier's Civilization VII\Mods\`
- macOS: `~/Library/Application Support/Civilization VII/Mods/`
- Linux/Steam Deck: `~/My Games/Sid Meier's Civilization VII/Mods/`

Then enable it in-game under **Additional Content → Mods**. It's UI-only
(`AffectsSavedGames=0`), so it can be toggled freely without invalidating saves.

Dev loop: enable the in-game console in `AppOptions.txt` (next to the `Mods`
folder) to get a **ReloadUI** button — JS/CSS changes reload in about a second.
Errors land in `Logs\UI.log`.

## Code format

```
C7L1;ANTIQUITY;H:AMINA:ROME;A:XERXES_ALT:PERSIA;A:GENGHIS_KHAN:SILLA
```

`C7L1` = format version. Then the age, then one `ROLE:LEADER:CIV` entry per
player (`H` human, `A` AI). Leader/civ tokens are the game's internal IDs
without the `LEADER_` / `CIVILIZATION_` prefixes; alternate personas use the
`_ALT` suffix (e.g. `NAPOLEON_ALT` = Napoleon, Revolutionary).

## Scope

Multiplayer lobby only — that's where a shared random assignment matters. Each
client can only set its own picks (a Civ VII rule, not a mod limitation), which
is why everyone pastes the code; the host alone controls the AI slots and the
Age setting.
