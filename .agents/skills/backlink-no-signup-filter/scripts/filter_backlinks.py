#!/usr/bin/env python3
"""Screen backlink exports for project fit and no-signup signal."""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

XLSX_NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

KEY_MAP = {
    "type": "Type",
    "url": "URL",
    "discovered from": "Discovered From",
    "has captcha": "Has Captcha",
    "link strategy": "Link Strategy",
    "link format": "Link Format",
    "has url field": "Has URL Field",
}


def load_project_profile(path: Path | None) -> dict[str, Any]:
    if path is None:
        return {}
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def canonicalize_record(record: dict[str, Any]) -> dict[str, str]:
    normalized = {}
    for raw_key, value in record.items():
        key = KEY_MAP.get(str(raw_key).strip().lower(), str(raw_key).strip())
        normalized[key] = "" if value is None else str(value).strip()
    for required in KEY_MAP.values():
        normalized.setdefault(required, "")
    return normalized


def load_xlsx(path: Path) -> list[dict[str, str]]:
    with zipfile.ZipFile(path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in root:
                parts = [node.text or "" for node in item.iter("{%s}t" % XLSX_NS["a"])]
                shared_strings.append("".join(parts))

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}
        sheet = next(iter(workbook.find("a:sheets", XLSX_NS)))
        target = "xl/" + rel_map[sheet.attrib["{%s}id" % XLSX_NS["r"]]]
        worksheet = ET.fromstring(archive.read(target))

        rows: list[list[str]] = []
        for row in worksheet.findall(".//a:sheetData/a:row", XLSX_NS):
            values: list[str] = []
            for cell in row.findall("a:c", XLSX_NS):
                cell_type = cell.attrib.get("t")
                value = cell.find("a:v", XLSX_NS)
                if value is None:
                    values.append("")
                    continue
                text = value.text or ""
                values.append(shared_strings[int(text)] if cell_type == "s" else text)
            rows.append(values)

    if not rows:
        return []

    headers = rows[0]
    records = []
    for row in rows[1:]:
        if not any(row):
            continue
        padded = row + [""] * (len(headers) - len(row))
        records.append(canonicalize_record(dict(zip(headers, padded))))
    return records


def load_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        return [canonicalize_record(row) for row in reader]


def load_json(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    if isinstance(payload, dict) and isinstance(payload.get("records"), list):
        rows = payload["records"]
    elif isinstance(payload, list):
        rows = payload
    else:
        raise ValueError("JSON input must be a list of records or an object with a records field.")
    return [canonicalize_record(row) for row in rows if isinstance(row, dict)]


def load_records(path: Path) -> list[dict[str, str]]:
    suffix = path.suffix.lower()
    if suffix == ".xlsx":
        return load_xlsx(path)
    if suffix == ".csv":
        return load_csv(path)
    if suffix == ".json":
        return load_json(path)
    raise ValueError(f"Unsupported input type: {suffix}")


def normalize_for_match(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def contains_any(text: str, keywords: list[str]) -> list[str]:
    normalized = normalize_for_match(text)
    padded = f" {normalized} "
    hits = []
    for keyword in keywords:
        candidate = normalize_for_match(keyword)
        if not candidate:
            continue
        if " " in candidate or len(candidate) > 3:
            if candidate in normalized:
                hits.append(keyword)
        else:
            if f" {candidate} " in padded:
                hits.append(keyword)
    return hits


def pick_fit_bucket(score: int) -> str:
    if score >= 6:
        return "high"
    if score >= 2:
        return "medium"
    return "low"


def analyze_record(record: dict[str, str], profile: dict[str, Any]) -> dict[str, Any]:
    url = record.get("URL", "")
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    text = " ".join(
        [
            domain,
            parsed.path.lower(),
            record.get("Type", "").lower(),
            record.get("Link Strategy", "").lower(),
        ]
    )

    fit_keywords = profile.get("fit_keywords", [])
    secondary_keywords = profile.get("secondary_keywords", [])
    negative_keywords = profile.get("negative_keywords", [])
    preferred_domains = set(profile.get("preferred_domains", []))
    blocked_patterns = profile.get("blocked_patterns", [])

    positive_hits = contains_any(text, fit_keywords)
    secondary_hits = contains_any(text, secondary_keywords)
    negative_hits = contains_any(text, negative_keywords)

    project_score = 0
    project_reasons: list[str] = []
    risk_flags: list[str] = []

    if domain in preferred_domains:
        project_score += 4
        project_reasons.append("preferred domain")
    if positive_hits:
        project_score += min(6, len(positive_hits) * 2)
        project_reasons.append("topic keywords: " + ", ".join(positive_hits[:4]))
    if secondary_hits:
        project_score += min(3, len(secondary_hits))
        project_reasons.append("adjacent keywords: " + ", ".join(secondary_hits[:4]))
    if negative_hits:
        project_score -= min(8, len(negative_hits) * 2)
        risk_flags.append("unrelated vertical: " + ", ".join(negative_hits[:4]))

    blocked_hit = next((pattern for pattern in blocked_patterns if pattern.lower() in text), None)
    if blocked_hit:
        project_score -= 4
        risk_flags.append(f"blocked pattern: {blocked_hit}")

    source_type = record.get("Type", "").lower()
    if source_type == "profile":
        project_score -= 4
        risk_flags.append("profile page")

    no_signup_score = 0
    no_signup_reasons: list[str] = []

    if record.get("Has Captcha", "").lower() == "no":
        no_signup_score += 3
        no_signup_reasons.append("no captcha in source sheet")
    else:
        no_signup_score -= 4
        risk_flags.append("captcha present in source sheet")

    if record.get("Has URL Field", "").lower() == "yes":
        no_signup_score += 3
        no_signup_reasons.append("website field in source sheet")
    else:
        no_signup_score -= 3
        risk_flags.append("no website field in source sheet")

    strategy = record.get("Link Strategy", "").lower()
    if strategy in {"url_field", "both"}:
        no_signup_score += 2
        no_signup_reasons.append(f"submission strategy: {strategy}")
    elif strategy == "in_content":
        no_signup_score += 1
        risk_flags.append("in-content link likely needed")

    if source_type == "blog_comment":
        no_signup_score += 2
        no_signup_reasons.append("comment-based path")
    elif source_type == "profile":
        no_signup_score -= 3

    link_format = record.get("Link Format", "").lower()
    if link_format == "html":
        no_signup_score += 1
        no_signup_reasons.append("html link format")

    fit_bucket = pick_fit_bucket(project_score)
    serious_risk = any(
        flag.startswith(prefix)
        for flag in risk_flags
        for prefix in ("blocked pattern", "profile page", "captcha present", "no website field")
    )

    if project_score >= 6 and no_signup_score >= 8 and not serious_risk and source_type == "blog_comment":
        decision = "preapproved"
    elif project_score >= 2 and no_signup_score >= 4 and not serious_risk:
        decision = "watchlist"
    else:
        decision = "reject"

    combined_reasons = []
    combined_reasons.extend(project_reasons[:2])
    combined_reasons.extend(no_signup_reasons[:2])
    if not combined_reasons:
        combined_reasons.append("weak project fit and weak no-signup signal")

    return {
        **record,
        "Domain": domain,
        "Project Fit Score": project_score,
        "Project Fit Bucket": fit_bucket,
        "No Signup Score": no_signup_score,
        "Decision": decision,
        "Why It Fits": "; ".join(combined_reasons),
        "Risk Flags": risk_flags,
        "Live Verification Required": decision in {"preapproved", "watchlist"},
    }


def build_output(
    records: list[dict[str, Any]],
    source_file: Path,
    project_profile: dict[str, Any],
) -> dict[str, Any]:
    counts = Counter(record["Decision"] for record in records)
    ordered = sorted(records, key=lambda item: (item["Decision"], -item["Project Fit Score"], item["Domain"]))
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_file": str(source_file),
        "project": project_profile.get("project_name", "unknown"),
        "site_url": project_profile.get("site_url", ""),
        "summary": {
            "total_rows": len(records),
            "preapproved": counts.get("preapproved", 0),
            "watchlist": counts.get("watchlist", 0),
            "reject": counts.get("reject", 0),
        },
        "preapproved": [record for record in ordered if record["Decision"] == "preapproved"],
        "watchlist": [record for record in ordered if record["Decision"] == "watchlist"],
        "reject": [record for record in ordered if record["Decision"] == "reject"],
        "records": ordered,
    }
    return payload


def main() -> int:
    parser = argparse.ArgumentParser(description="Filter backlink targets for project fit and no-signup signal.")
    parser.add_argument("--input", required=True, help="Path to the backlink source file.")
    parser.add_argument("--project-profile", help="Path to a project profile JSON file.")
    parser.add_argument("--output", required=True, help="Path to the JSON output file.")
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    output_path = Path(args.output).resolve()
    profile_path = Path(args.project_profile).resolve() if args.project_profile else None

    project_profile = load_project_profile(profile_path)
    records = [analyze_record(record, project_profile) for record in load_records(input_path)]
    payload = build_output(records, input_path, project_profile)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)

    summary = payload["summary"]
    print(
        json.dumps(
            {
                "source_file": str(input_path),
                "output_file": str(output_path),
                **summary,
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
