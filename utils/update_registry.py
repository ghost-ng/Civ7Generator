#!/usr/bin/env python3
"""Refresh data/registry.json from 2K's official Civ VII pages and report drift.

Scrapes (stdlib only, no dependencies):
  - https://civilization.2k.com/civ-vii/game-guide/leaders/        -> leader roster
  - https://civilization.2k.com/civ-vii/game-guide/civilizations/  -> civ roster + age
  - https://civilization.2k.com/civ-vii/content-collections/       -> DLC collection contents

Writes data/registry.json and prints a drift report comparing the registry
against the data embedded in index.html (civList / leaderDict / dlcPacks).

Exit codes: 0 = ok (registry may have been updated), 1 = fetch/parse failure.
Drift does not affect the exit code; the workflow reads drift-report.md.

Usage:
  python utils/update_registry.py [--repo-root PATH] [--report PATH]
"""

import argparse
import html
import json
import re
import sys
import unicodedata
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE_URL = "https://civilization.2k.com/civ-vii"
USER_AGENT = "Mozilla/5.0 (registry-updater; +https://github.com/ghost-ng/Civ7Generator)"

# Content that never appears on the collections page: launch-era edition and
# account content, and free-update leaders that count as base game.
STATIC_PACKS = [
    {"name": "Tecumseh & Shawnee Pack", "leaders": ["Tecumseh"], "civs": ["Shawnee"]},
    {"name": "Deluxe Edition Content", "leaders": [], "civs": [],
     "personas": ["Friedrich (Baroque)", "Xerxes (The Achaemenid)"]},
    {"name": "Founder's Edition Content", "leaders": [], "civs": [],
     "personas": ["Ashoka (World Conqueror)", "Himiko (High Shaman)"]},
    {"name": "Napoleon (2K Account Rewards)", "leaders": [], "civs": [],
     "personas": ["Napoleon (Revolutionary)", "Napoleon (Emperor)"]},
]
FREE_LEADERS = ["Tecumseh", "Gilgamesh", "Alexander the Great"]  # Tecumseh: pack; rest: free updates

# Display-name differences between 2K's pages and the app's names.
ALIASES = {
    "persia": "achaemenid persia",
    "maurya": "maurya india",
    "mississippian": "mississippians",
    "hawaii": "hawai'i",
    "chola india": "chola",
    "sengoku": "sengoku japan",
    "catherine the great": "catherine",
    "edward teach": "blackbeard",
}


def norm(name: str) -> str:
    """Normalize a display name for comparison across sources."""
    s = unicodedata.normalize("NFKD", name)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"\s*\(.*?\)", "", s)  # drop persona qualifiers
    s = re.sub(r"[^a-z' ]", "", s.lower().strip())
    s = re.sub(r"\s+", " ", s).strip()
    return ALIASES.get(s, s)


def pack_norm(name: str) -> str:
    """Normalize a DLC pack/collection name: '&' vs 'and', 'Collection' suffix."""
    s = norm(name.replace("&", " and "))
    s = re.sub(r"\b(and|the|collection)\b", "", s)
    return re.sub(r"\s+", " ", s).strip()


def fetch(path: str) -> str:
    req = urllib.request.Request(BASE_URL + path, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def parse_leaders(page: str) -> list[str]:
    """Leader tiles appear as JSON: "slug":"/game-guide/leaders/<slug>/","title":"<Name>"."""
    found = re.findall(r'"slug":"/game-guide/leaders/[^"]+/","title":"([^"]+)"', page)
    also = re.findall(r'Leaders HUB \| ([^"|]+)"', html.unescape(page))
    seen, leaders = set(), []
    for name in found + [n.strip() for n in also]:
        name = name.strip()
        if name and norm(name) not in seen:
            seen.add(norm(name))
            leaders.append(name)
    return leaders


def parse_civs(page: str) -> list[dict]:
    """Civ tiles carry an age-labelled breadcrumb: 'Civilizations HUB | <Age> Age | <Name>'."""
    tiles = re.findall(r'Civilizations HUB \| (\w+) Age \| ([^"|]+)"', html.unescape(page))
    plain = re.findall(r'"slug":"/game-guide/civilizations/[^"]+/","title":"([^"]+)"', page)
    seen, civs = set(), []
    for age, name in tiles:
        name = name.strip()
        if name and norm(name) not in seen:
            seen.add(norm(name))
            civs.append({"name": name, "age": age})
    for name in plain:
        name = name.strip()
        if name and norm(name) not in seen:
            seen.add(norm(name))
            civs.append({"name": name, "age": None})
    return civs


def parse_collections(page: str) -> list[dict]:
    """Each collection body reads: '<Name> Collection includes: N new leaders: A, B
    N new civilizations: C, D ...' (after tag/entity stripping)."""
    text = re.sub(r"<[^>]+>", " ", html.unescape(page))
    text = re.sub(r"\s+", " ", text)
    collections = []
    seen = set()
    for m in re.finditer(
        r'([A-Z][\w&\' ]+? Collection)\*? includes: (.*?)(?=[A-Z][\w&\' ]+? Collection\*? includes:|$)',
        text,
    ):
        name, body = m.group(1).strip(), m.group(2)
        # The greedy prefix can swallow earlier page text ending in "Collection";
        # keep only the final "<Words> Collection" phrase.
        name = re.sub(r"^.*Collection\s+(?=[A-Z])", "", name).strip()
        if pack_norm(name) in seen:
            continue
        seen.add(pack_norm(name))
        leaders_m = re.search(r'leaders?: ([^:]+?)(?: \d+ new|$)', body)
        civs_m = re.search(r'civilizations?: ([^:]+?)(?: \d+ new|$)', body)
        split = lambda s: [x.strip() for x in re.split(r",| and ", s) if x.strip()] if s else []
        entry = {
            "name": name,
            "leaders": split(leaders_m.group(1)) if leaders_m else [],
            "civs": split(civs_m.group(1)) if civs_m else [],
        }
        if entry["leaders"] or entry["civs"]:
            collections.append(entry)
    return collections


def parse_app_data(index_html: str) -> dict:
    """Pull civList, leaderDict keys, and dlcPacks out of index.html."""
    civ_m = re.search(r"const civList = \[(.*?)\];", index_html, re.S)
    civs = re.findall(r'"([^"]+)"', civ_m.group(1)) if civ_m else []

    dict_m = re.search(r"const leaderDict = \{(.*?)\};", index_html, re.S)
    leaders = re.findall(r'^\s*"([^"]+)":', dict_m.group(1), re.M) if dict_m else []

    packs_m = re.search(r"const dlcPacks = \[(.*?)\n    \];", index_html, re.S)
    packs = []
    if packs_m:
        for pm in re.finditer(r'name: "([^"]+)",\s*civs: \[([^\]]*)\],\s*leaders: \[([^\]]*)\]', packs_m.group(1)):
            packs.append({
                "name": pm.group(1),
                "civs": re.findall(r'"([^"]+)"', pm.group(2)),
                "leaders": re.findall(r'"([^"]+)"', pm.group(3)),
            })
    return {"civs": civs, "leaders": leaders, "packs": packs}


def build_registry() -> dict:
    leaders_page = fetch("/game-guide/leaders/")
    civs_page = fetch("/game-guide/civilizations/")
    collections_page = fetch("/content-collections/")

    leaders = parse_leaders(leaders_page)
    civs = parse_civs(civs_page)
    collections = parse_collections(collections_page)

    if len(leaders) < 15 or len(civs) < 25 or len(collections) < 2:
        raise RuntimeError(
            f"Parse sanity check failed: {len(leaders)} leaders, {len(civs)} civs, "
            f"{len(collections)} collections — 2K page structure may have changed."
        )

    # Attribute DLC source to each civ/leader from collections + static packs.
    dlc_of = {}
    for pack in collections + STATIC_PACKS:
        for item in pack.get("leaders", []) + pack.get("civs", []):
            dlc_of[norm(item)] = pack["name"]

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": BASE_URL,
        "civs": [
            {**c, "dlc": dlc_of.get(norm(c["name"]))}
            for c in sorted(civs, key=lambda c: (c["age"] or "", c["name"]))
        ],
        "leaders": [
            {"name": l, "dlc": dlc_of.get(norm(l))}
            for l in sorted(leaders)
        ],
        "collections": collections,
        "staticPacks": STATIC_PACKS,
    }


def drift_report(registry: dict, app: dict) -> list[str]:
    lines = []
    app_civs = {norm(c) for c in app["civs"]}
    app_leaders = {norm(l) for l in app["leaders"]}

    # The app currently ships Antiquity civs only.
    for civ in registry["civs"]:
        if civ["age"] == "Antiquity" and norm(civ["name"]) not in app_civs:
            lines.append(f"- Antiquity civ missing from app civList: **{civ['name']}**"
                         + (f" (from {civ['dlc']})" if civ["dlc"] else " (base game)"))

    for leader in registry["leaders"]:
        if norm(leader["name"]) not in app_leaders:
            lines.append(f"- Leader missing from app leaderDict: **{leader['name']}**"
                         + (f" (from {leader['dlc']})" if leader["dlc"] else " (base game)"))

    # Collections on 2K's page that the app's dlcPacks doesn't know about.
    app_pack_names = {pack_norm(p["name"]) for p in app["packs"]}
    app_pack_items = {norm(i) for p in app["packs"] for i in p["civs"] + p["leaders"]}
    for coll in registry["collections"]:
        if pack_norm(coll["name"]) not in app_pack_names:
            lines.append(f"- DLC collection missing from app dlcPacks: **{coll['name']}**")
        else:
            for item in coll["leaders"]:
                if norm(item) not in app_pack_items and norm(item) in app_leaders:
                    lines.append(f"- {coll['name']}: leader **{item}** is in the app but not "
                                 f"mapped to this pack in dlcPacks")
    return lines


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".", type=Path)
    parser.add_argument("--report", default=None, type=Path,
                        help="Where to write the drift report (markdown); default: <repo>/drift-report.md")
    args = parser.parse_args()

    root = args.repo_root.resolve()
    report_path = args.report or root / "drift-report.md"

    try:
        registry = build_registry()
    except Exception as exc:  # noqa: BLE001 - report any scrape failure to CI
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    out = root / "data" / "registry.json"
    out.parent.mkdir(parents=True, exist_ok=True)

    previous = None
    if out.exists():
        previous = json.loads(out.read_text(encoding="utf-8"))

    changed = previous is None or {k: v for k, v in registry.items() if k != "generatedAt"} != {
        k: v for k, v in previous.items() if k != "generatedAt"
    }
    if changed:
        out.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"registry.json updated ({len(registry['civs'])} civs, "
              f"{len(registry['leaders'])} leaders, {len(registry['collections'])} collections)")
    else:
        print("registry.json unchanged")

    app = parse_app_data((root / "index.html").read_text(encoding="utf-8"))
    lines = drift_report(registry, app)
    if lines:
        report = ("## Civ VII registry drift\n\n"
                  "The official 2K pages list content that `index.html` doesn't have yet:\n\n"
                  + "\n".join(lines) + "\n")
        report_path.write_text(report, encoding="utf-8")
        print(f"\nDRIFT DETECTED ({len(lines)} items) -> {report_path}")
        print(report)
    else:
        if report_path.exists():
            report_path.unlink()
        print("No drift: app data matches the official pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
