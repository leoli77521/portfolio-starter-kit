#!/usr/bin/env python3
"""Shortlist approved backlink targets for one topical campaign."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


def default_registry() -> Path:
    return Path(__file__).resolve().parents[1] / "assets" / "backlink-type-registry.json"


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_text(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def keyword_hits(text: str, keywords: list[str]) -> list[str]:
    normalized = normalize_text(text)
    padded = f" {normalized} "
    hits: list[str] = []
    for keyword in keywords:
        candidate = normalize_text(keyword)
        if not candidate:
            continue
        if " " in candidate or len(candidate) > 3:
            if candidate in normalized:
                hits.append(keyword)
        elif f" {candidate} " in padded:
            hits.append(keyword)
    return hits


def resolve_registry_entry(target: dict[str, Any], registry: list[dict[str, Any]]) -> dict[str, Any] | None:
    source_type = target.get("source_type", "")
    submission_mode = target.get("submission_mode", "")
    for entry in registry:
        if source_type in entry.get("input_source_types", []):
            return entry
        if submission_mode in entry.get("input_submission_modes", []):
            return entry
    return None


def score_target(target: dict[str, Any], campaign: dict[str, Any], registry_entry: dict[str, Any] | None) -> dict[str, Any]:
    text_parts = [
        target.get("platform", ""),
        target.get("domain", ""),
        target.get("target_url", ""),
        target.get("comment_brief", ""),
        " ".join(target.get("topic_signals", [])),
    ]
    campaign_keywords = campaign.get("keywords", []) + campaign.get("tags", [])
    hits = keyword_hits(" ".join(text_parts), [str(item) for item in campaign_keywords])

    verification_status = target.get("verification", {}).get("status", "")
    project_fit = target.get("project_fit", "")

    score = len(hits) * 3
    if project_fit == "high":
        score += 2
    elif project_fit == "medium":
        score += 1

    if verification_status == "verified_no_signup":
        score += 2

    if target.get("link_policy") == "website_field_only":
        score += 1

    if registry_entry and registry_entry.get("status") == "active":
        score += 1
    elif registry_entry:
        score -= 1

    threshold = int(registry_entry.get("fit_threshold", 4)) if registry_entry else 4

    if hits and verification_status == "verified_no_signup" and score >= threshold and registry_entry and registry_entry.get("status") == "active":
        status = "shortlist"
    elif hits or project_fit == "high":
        status = "watchlist"
    else:
        status = "reject"

    note_parts = []
    if hits:
        note_parts.append("matched: " + ", ".join(hits[:4]))
    if registry_entry:
        note_parts.append(f"type: {registry_entry.get('id', 'unknown')}")
    if not note_parts:
        note_parts.append("weak topical overlap")

    return {
        **target,
        "selection_status": status,
        "selection_score": score,
        "matched_keywords": hits,
        "recommended_destination_url": campaign.get("destination_url", ""),
        "selection_note": "; ".join(note_parts),
    }


def write_markdown(report_path: Path, payload: dict[str, Any]) -> None:
    lines = [
        "# Topical Target Shortlist",
        "",
        f"- Campaign: {payload['campaign_title']}",
        f"- Destination URL: {payload['destination_url']}",
        f"- Total targets: {payload['summary']['total_targets']}",
        f"- Shortlist: {payload['summary']['shortlist']}",
        f"- Watchlist: {payload['summary']['watchlist']}",
        f"- Reject: {payload['summary']['reject']}",
        "",
        "| Domain | Status | Score | Destination | Note |",
        "|--------|--------|-------|-------------|------|",
    ]
    for item in payload["records"]:
        lines.append(
            f"| {item.get('domain', '')} | {item['selection_status']} | {item['selection_score']} | {item['recommended_destination_url']} | {item['selection_note']} |"
        )
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Shortlist approved backlink targets for one campaign.")
    parser.add_argument("--campaign", required=True, help="Path to a campaign brief JSON file.")
    parser.add_argument("--targets", required=True, help="Path to an approved targets JSON file.")
    parser.add_argument("--registry", default=str(default_registry()), help="Path to the backlink type registry JSON.")
    parser.add_argument("--max-targets", type=int, help="Optional maximum number of shortlisted records to keep.")
    parser.add_argument("--output", required=True, help="Path to the output JSON file.")
    parser.add_argument("--report", help="Optional Markdown report path.")
    args = parser.parse_args()

    campaign = load_json(Path(args.campaign).resolve())
    targets = load_json(Path(args.targets).resolve())
    registry = load_json(Path(args.registry).resolve())

    if not isinstance(targets, list):
        raise ValueError("Targets JSON must be a list.")
    if not isinstance(registry, list):
        raise ValueError("Registry JSON must be a list.")

    scored = [score_target(target, campaign, resolve_registry_entry(target, registry)) for target in targets]
    scored.sort(key=lambda item: (-item["selection_score"], item.get("domain", "")))

    if args.max_targets:
        shortlisted = [item for item in scored if item["selection_status"] == "shortlist"][: args.max_targets]
        keep_ids = {item.get("id") for item in shortlisted}
        scored = [item for item in scored if item["selection_status"] != "shortlist" or item.get("id") in keep_ids]

    payload = {
        "campaign_title": campaign.get("title", ""),
        "destination_url": campaign.get("destination_url", ""),
        "summary": {
            "total_targets": len(scored),
            "shortlist": sum(1 for item in scored if item["selection_status"] == "shortlist"),
            "watchlist": sum(1 for item in scored if item["selection_status"] == "watchlist"),
            "reject": sum(1 for item in scored if item["selection_status"] == "reject"),
        },
        "records": scored,
    }

    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)

    if args.report:
        write_markdown(Path(args.report).resolve(), payload)

    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
