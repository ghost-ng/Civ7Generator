#!/usr/bin/env python3
"""Refresh data/registry.json from 2K's official Civ VII pages and report drift.

Scrapes (stdlib only, no dependencies):
  - https://civilization.2k.com/civ-vii/game-guide/leaders/        -> leader roster
  - https://civilization.2k.com/civ-vii/game-guide/civilizations/  -> civ roster + age
  - https://civilization.2k.com/civ-vii/content-collections/       -> DLC collection contents

Writes data/registry.json and prints a drift report comparing the registry
against the data embedded in index.html (civAges / leaderDict / dlcPacks).

Exit codes: 0 = ok (registry may have been updated), 1 = fetch/parse failure.
Drift does not affect the exit code; the workflow reads drift-report.md.

Usage:
  python utils/update_registry.py [--repo-root PATH] [--report PATH]
"""

import argparse
import html
import json
import re
import subprocess
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE_URL = "https://civilization.2k.com/civ-vii"
USER_AGENT = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

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

# 2K's own age breadcrumbs are occasionally wrong; override by normalized name.
AGE_OVERRIDES = {
    "assyria": "Antiquity",  # 2K labels it Exploration; it's an Antiquity civ
}

# Display-name differences between 2K's pages and the app's names.
ALIASES = {
    "persia": "achaemenid persia",
    "maurya": "maurya india",
    "mississippian": "mississippians",
    "hawaii": "hawai'i",
    "chola india": "chola",
    "sengoku": "sengoku japan",
    "mongolian": "mongolia",
    "norman": "normans",
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


BROWSER_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


def _fetch_urllib(url: str) -> str:
    req = urllib.request.Request(url, headers=BROWSER_HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def _fetch_curl(url: str) -> str:
    args = ["curl", "-sS", "--fail", "--max-time", "60", "--compressed"]
    for k, v in BROWSER_HEADERS.items():
        args += ["-H", f"{k}: {v}"]
    return subprocess.run(args + [url], check=True, capture_output=True,
                          text=True, encoding="utf-8", errors="replace").stdout


def fetch(path: str) -> str:
    # 2K's CDN 403s non-browser requests from datacenter IPs (e.g. GitHub
    # Actions runners): urllib is tried first, then curl (a different TLS
    # fingerprint, which the CDN's bot filter treats differently).
    url = BASE_URL + path
    last_err = None
    for attempt in range(2):
        if attempt:
            time.sleep(10)
        try:
            return _fetch_urllib(url)
        except urllib.error.HTTPError as exc:
            print(f"urllib fetch of {url} failed ({exc}); trying curl", file=sys.stderr)
            last_err = exc
        try:
            return _fetch_curl(url)
        except (subprocess.CalledProcessError, FileNotFoundError) as exc:
            print(f"curl fetch of {url} failed ({exc})", file=sys.stderr)
            last_err = exc
    raise last_err


WIKI_API = "https://civilization.fandom.com/api.php"

# The Civ wiki names civ pages adjectivally ("Aksumite") where 2K and the app
# use the in-game name ("Aksum"). Maps norm(wiki title) -> norm(2K name).
WIKI_ALIASES = {
    "achaemenid persian": "achaemenid persia",
    "aksumite": "aksum",
    "assyrian": "assyria",
    "carthaginian": "carthage",
    "egyptian": "egypt",
    "greek": "greece",
    "han": "han china",
    "heian": "heian japan",
    "mauryan": "maurya india",
    "roman": "rome",
    "tongan": "tonga",
    "bulgarian": "bulgaria",
    "hawaiian": "hawai'i",
    "icelandic": "iceland",
    "incan": "inca",
    "ming": "ming china",
    "mongolian": "mongolia",
    "pirate": "republic of pirates",
    "spanish": "spain",
    "vietnamese": "dai viet",
    "american": "america",
    "british": "great britain",
    "bugandan": "buganda",
    "french imperial": "french empire",
    "meiji japanese": "meiji japan",
    "mexican": "mexico",
    "mughal": "mughal india",
    "nepalese": "nepal",
    "ottoman": "ottomans",
    "prussian": "prussia",
    "qing": "qing china",
    "russian": "russia",
    "siamese": "siam",
    "alexander": "alexander the great",
}


def wiki_norm(title: str) -> str:
    s = norm(re.sub(r"\s*\(Civ7\)$", "", title.strip()))
    return WIKI_ALIASES.get(s, s)


def fetch_wiki_category(category: str) -> list[str]:
    """Main-namespace member titles of a wiki category, '(Civ7)' suffix kept,
    persona subpages ('Ashoka (Civ7)/World Conqueror') and the category's own
    list page excluded."""
    url = (f"{WIKI_API}?action=query&list=categorymembers"
           f"&cmtitle=Category:{urllib.parse.quote(category)}"
           f"&cmlimit=500&cmnamespace=0&format=json")
    req = urllib.request.Request(url, headers=BROWSER_HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
    return [m["title"] for m in data["query"]["categorymembers"]
            if "/" not in m["title"] and not m["title"].startswith(category.split(" (")[0])]


def build_registry_from_wiki(previous: dict | None) -> dict:
    """Fallback roster source for environments 2K's CDN blocks (e.g. GitHub
    runners): the Civ wiki's MediaWiki API. Display names and DLC attribution
    are taken from the previous registry when a roster entry matches, so the
    registry stays stable across sources; collections carry over unchanged
    (the wiki has no equivalent of 2K's collections page)."""
    prev = previous or {}
    prev_civs = {norm(c["name"]): c for c in prev.get("civs", [])}
    prev_leaders = {norm(l["name"]): l for l in prev.get("leaders", [])}

    civs = []
    for age in ("Antiquity", "Exploration", "Modern"):
        for title in fetch_wiki_category(f"{age} age civilizations (Civ7)"):
            key = wiki_norm(title)
            known = prev_civs.get(key)
            civs.append({"name": known["name"] if known else re.sub(r"\s*\(Civ7\)$", "", title),
                         "age": AGE_OVERRIDES.get(key, age),
                         "dlc": known.get("dlc") if known else None})

    leaders = []
    for title in fetch_wiki_category("Leaders (Civ7)"):
        key = wiki_norm(title)
        known = prev_leaders.get(key)
        leaders.append({"name": known["name"] if known else re.sub(r"\s*\(Civ7\)$", "", title),
                        "dlc": known.get("dlc") if known else None})

    if len(leaders) < 15 or len(civs) < 25:
        raise RuntimeError(
            f"Wiki parse sanity check failed: {len(leaders)} leaders, {len(civs)} civs "
            "— category structure may have changed."
        )

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": f"{BASE_URL} (rosters via {WIKI_API} fallback)",
        "civs": sorted(civs, key=lambda c: (c["age"] or "", c["name"])),
        "leaders": sorted(leaders, key=lambda l: l["name"]),
        "collections": prev.get("collections", []),
        "staticPacks": STATIC_PACKS,
    }


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
            civs.append({"name": name, "age": AGE_OVERRIDES.get(norm(name), age)})
    for name in plain:
        name = name.strip()
        if name and norm(name) not in seen:
            seen.add(norm(name))
            civs.append({"name": name, "age": AGE_OVERRIDES.get(norm(name))})
    return civs


# Words that never appear inside a civ/leader name on the collections page;
# their presence marks list-capture overrun into surrounding copy.
_ITEM_SENTINELS = ("collection", "includes", "wonder", "steam", "epic", "available",
                   "buy", "purchase", "edition", "content")


def _clean_items(raw: str, declared_count: int, label: str) -> list[str]:
    """Split a scraped 'A, B, C and D' list, drop overrun junk, honor the
    declared count, and warn loudly when they disagree."""
    items = []
    for part in re.split(r",| and ", raw):
        part = part.strip(" .")
        # Overrun copy glued to the last real item ("Iceland Available now: ...")
        # — truncate at the first sentinel word to recover the name.
        tokens = part.split()
        for i, tok in enumerate(tokens):
            if any(s in tok.lower() for s in _ITEM_SENTINELS) or ":" in tok:
                tokens = tokens[:i]
                break
        part = " ".join(tokens)
        if not part or len(tokens) > 4:
            continue
        items.append(part)
    items = items[:declared_count]
    if len(items) != declared_count:
        print(f"WARNING: {label}: expected {declared_count} items, kept {len(items)} "
              f"from {raw[:120]!r} — page copy may have changed", file=sys.stderr)
    return items


def parse_collections(page: str) -> list[dict]:
    """Each collection body reads: '<Name> Collection includes: N new leaders: A, B
    N new civilizations: C, D ...' (after tag/entity stripping). List capture is
    anchored on the declared counts so surrounding copy can't bleed in."""
    text = re.sub(r"<[^>]+>", " ", html.unescape(page))
    text = re.sub(r"\s+", " ", text)
    collections = []
    seen = set()
    matches = list(re.finditer(r"([A-Z][\w&' ]+? Collection)\*? includes:", text))
    for i, m in enumerate(matches):
        # The greedy prefix can swallow earlier page text ending in "Collection";
        # keep only the final "<Words> Collection" phrase.
        name = re.sub(r"^.*Collection\s+(?=[A-Z])", "", m.group(1).strip()).strip()
        if pack_norm(name) in seen:
            continue
        # Bound the body at the next collection heading so a section without its
        # own lists can't capture a neighbor's.
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[m.end():end]
        leaders_m = re.search(r"(\d+) new (?:playable )?leaders?: (.*?)(?= \d+ new |$)", body)
        civs_m = re.search(r"(\d+) new (?:playable )?civilizations?: (.*?)(?= \d+ new |$)", body)
        entry = {
            "name": name,
            "leaders": _clean_items(leaders_m.group(2), int(leaders_m.group(1)),
                                    f"{name} leaders") if leaders_m else [],
            "civs": _clean_items(civs_m.group(2), int(civs_m.group(1)),
                                 f"{name} civs") if civs_m else [],
        }
        if entry["leaders"] or entry["civs"]:
            seen.add(pack_norm(name))
            collections.append(entry)
    return collections


def parse_app_data(index_html: str) -> dict:
    """Pull civAges, leaderDict keys, and dlcPacks out of index.html."""
    # civList is derived from civAges in the app, so the map is the source of
    # truth for both the roster and each civ's age.
    civ_m = re.search(r"const civAges = \{(.*?)\};", index_html, re.S)
    civ_ages = dict(re.findall(r'^\s*"([^"]+)": "([^"]+)"', civ_m.group(1), re.M)) if civ_m else {}
    civs = list(civ_ages)

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
    return {"civs": civs, "civ_ages": civ_ages, "leaders": leaders, "packs": packs}


def parse_bonuses(bonuses_js: str) -> dict:
    """Pull the civBonuses / leaderBonuses keys out of data/bonuses.js."""
    out = {}
    for kind, var in (("civs", "civBonuses"), ("leaders", "leaderBonuses")):
        m = re.search(rf"window\.{var} = \{{(.*?)\n\}};", bonuses_js, re.S)
        # Entry keys are quoted at 4-space indent; nested fields are deeper.
        out[kind] = re.findall(r'^    "([^"]+)": \{', m.group(1), re.M) if m else []
    return out


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


def drift_report(registry: dict, app: dict, bonuses: dict | None = None) -> list[str]:
    lines = []
    app_civs = {norm(c) for c in app["civs"]}
    app_leaders = {norm(l) for l in app["leaders"]}

    # The app ships civs from every age; each must be present in civAges with
    # the age 2K lists. Civs with no reliable age label (missing breadcrumb)
    # are flagged with a caveat rather than silently skipped — 2K's age labels
    # have been wrong before (see AGE_OVERRIDES), so err toward flagging.
    app_ages = {norm(name): age for name, age in app.get("civ_ages", {}).items()}
    for civ in registry["civs"]:
        key = norm(civ["name"])
        if key not in app_civs:
            caveat = " — age unknown, verify" if civ["age"] is None else ""
            lines.append(f"- {civ['age'] or 'Unknown-age'} civ missing from app civAges: **{civ['name']}**"
                         + (f" (from {civ['dlc']})" if civ["dlc"] else " (base game)") + caveat)
        elif civ["age"] and app_ages.get(key) and app_ages[key] != civ["age"]:
            lines.append(f"- Age mismatch for **{civ['name']}**: app civAges says "
                         f"{app_ages[key]}, 2K says {civ['age']}")

    for leader in registry["leaders"]:
        if norm(leader["name"]) not in app_leaders:
            lines.append(f"- Leader missing from app leaderDict: **{leader['name']}**"
                         + (f" (from {leader['dlc']})" if leader["dlc"] else " (base game)"))

    # Collections on 2K's page that the app's dlcPacks doesn't know about.
    app_pack_names = {pack_norm(p["name"]) for p in app["packs"]}
    app_pack_items = {norm(i) for p in app["packs"] for i in p["civs"] + p["leaders"]}
    for coll in registry["collections"]:
        coll_norm = pack_norm(coll["name"])
        # Substring match tolerates a scraper-mangled registry name (e.g. a
        # stolen leading word) still containing the app's pack name.
        if not any(ap == coll_norm or ap in coll_norm for ap in app_pack_names):
            lines.append(f"- DLC collection missing from app dlcPacks: **{coll['name']}**")
            continue
        for kind, items, app_known in (("leader", coll["leaders"], app_leaders),
                                       ("civ", coll["civs"], app_civs)):
            for item in items:
                if norm(item) not in app_pack_items and norm(item) in app_known:
                    lines.append(f"- {coll['name']}: {kind} **{item}** is in the app but not "
                                 f"mapped to this pack in dlcPacks")

    # Anything the app ships must also have a tooltip entry in data/bonuses.js.
    if bonuses is not None:
        bonus_civs = {norm(c) for c in bonuses["civs"]}
        bonus_leaders = {norm(l) for l in bonuses["leaders"]}
        for civ in app["civs"]:
            if norm(civ) not in bonus_civs:
                lines.append(f"- Civ missing from the data/bonuses.js tooltip catalog: **{civ}**")
        for leader in app["leaders"]:
            if norm(leader) not in bonus_leaders:
                lines.append(f"- Leader missing from the data/bonuses.js tooltip catalog: **{leader}**")
    return lines


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".", type=Path)
    parser.add_argument("--report", default=None, type=Path,
                        help="Where to write the drift report (markdown); default: <repo>/drift-report.md")
    args = parser.parse_args()

    root = args.repo_root.resolve()
    report_path = args.report or root / "drift-report.md"

    out = root / "data" / "registry.json"
    out.parent.mkdir(parents=True, exist_ok=True)

    previous = None
    if out.exists():
        previous = json.loads(out.read_text(encoding="utf-8"))

    try:
        registry = build_registry()
    except Exception as exc:  # noqa: BLE001 - any scrape failure triggers the fallback
        # 2K's CDN blocks datacenter IPs (GitHub runners get 403 on every
        # page), so rebuild the rosters from the Civ wiki API instead.
        print(f"WARNING: 2K scrape failed ({exc}); using the Civ wiki API fallback",
              file=sys.stderr)
        try:
            registry = build_registry_from_wiki(previous)
        except Exception as exc2:  # noqa: BLE001 - report fallback failure to CI
            print(f"ERROR: {exc2}", file=sys.stderr)
            return 1

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
    # Mirror the scrape-side sanity check: if index.html was reformatted and the
    # regexes silently missed, fail the run instead of filing a bogus
    # everything-is-missing drift report.
    if len(app["civs"]) < 10 or len(app["leaders"]) < 15 or len(app["packs"]) < 4:
        print(f"ERROR: index.html parse sanity check failed: {len(app['civs'])} civs, "
              f"{len(app['leaders'])} leaders, {len(app['packs'])} packs — "
              "parse_app_data's regexes no longer match the file's formatting.",
              file=sys.stderr)
        return 1
    bonuses_path = root / "data" / "bonuses.js"
    bonuses = None
    if bonuses_path.exists():
        bonuses = parse_bonuses(bonuses_path.read_text(encoding="utf-8"))
        if len(bonuses["civs"]) < 10 or len(bonuses["leaders"]) < 15:
            print(f"ERROR: bonuses.js parse sanity check failed: {len(bonuses['civs'])} civs, "
                  f"{len(bonuses['leaders'])} leaders — parse_bonuses's regexes no longer "
                  "match the file's formatting.", file=sys.stderr)
            return 1
    lines = drift_report(registry, app, bonuses)
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
