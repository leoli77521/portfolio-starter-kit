#!/usr/bin/env python3
"""Build a validated submission queue for approved backlink targets."""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def destination_map(site_profile: dict[str, Any]) -> dict[str, dict[str, str]]:
    return {
        item["label"]: item
        for item in site_profile.get("preferred_link_destinations", [])
        if isinstance(item, dict) and item.get("label") and item.get("url")
    }


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
        else:
            if f" {candidate} " in padded:
                hits.append(keyword)
    return hits


def route_target(
    site_profile: dict[str, Any],
    target: dict[str, Any],
    destinations: dict[str, dict[str, str]],
) -> tuple[str, dict[str, Any]]:
    explicit_label = target.get("preferred_destination_label", "auto")
    if explicit_label and explicit_label != "auto":
        return explicit_label, {
            "strategy": "explicit",
            "rule_id": "",
            "matched_keywords": [],
        }

    routing_text_parts = [
        target.get("platform", ""),
        target.get("domain", ""),
        target.get("target_url", ""),
        target.get("comment_brief", ""),
    ]
    routing_text_parts.extend(target.get("topic_signals", []))
    routing_text = " ".join(part for part in routing_text_parts if part)

    best_match: dict[str, Any] | None = None
    for index, rule in enumerate(site_profile.get("routing_rules", [])):
        if not isinstance(rule, dict):
            continue
        label = rule.get("label", "")
        if label not in destinations:
            continue

        include_hits = keyword_hits(routing_text, rule.get("keywords", []))
        exclude_hits = keyword_hits(routing_text, rule.get("exclude_keywords", []))
        min_matches = int(rule.get("min_matches", 1))
        priority = int(rule.get("priority", 0))

        if exclude_hits or len(include_hits) < min_matches:
            continue

        score = priority * 100 + len(include_hits)
        candidate = {
            "label": label,
            "strategy": "rule",
            "rule_id": rule.get("id", f"rule-{index + 1}"),
            "matched_keywords": include_hits,
            "score": score,
        }
        if best_match is None or candidate["score"] > best_match["score"]:
            best_match = candidate

    if best_match is not None:
        return best_match["label"], best_match

    fallback_label = (
        target.get("fallback_destination_label")
        or site_profile.get("fallback_destination_label")
        or "homepage"
    )
    return fallback_label, {
        "strategy": "fallback",
        "rule_id": "",
        "matched_keywords": [],
    }


def build_queue(site_profile: dict[str, Any], targets: list[dict[str, Any]]) -> dict[str, Any]:
    destinations = destination_map(site_profile)
    queue = []

    public_name = site_profile.get("public_name", "")
    public_email = site_profile.get("public_email", "")
    default_website = site_profile.get("default_website", "")

    for target in targets:
        verification = target.get("verification", {})
        destination_label, routing = route_target(site_profile, target, destinations)
        destination = destinations.get(destination_label)
        missing = []

        if not public_name:
            missing.append("public_name")
        if not public_email:
            missing.append("public_email")
        if not destination:
            missing.append(f"preferred_link_destinations.{destination_label}")

        verification_status = verification.get("status", "")
        if verification_status != "verified_no_signup":
            missing.append("verified_no_signup")

        status = "ready" if not missing else "manual_review"
        queue.append(
            {
                "id": target.get("id", ""),
                "platform": target.get("platform", ""),
                "domain": target.get("domain", ""),
                "target_url": target.get("target_url", ""),
                "submission_mode": target.get("submission_mode", "browser_comment"),
                "status": status,
                "blocking_reasons": missing,
                "comment_name": public_name,
                "comment_email": public_email,
                "comment_website": destination["url"] if destination else default_website,
                "destination_label": destination_label,
                "destination_reason": destination.get("when_to_use", "") if destination else "",
                "routing_strategy": routing.get("strategy", "fallback"),
                "routing_rule_id": routing.get("rule_id", ""),
                "routing_matched_keywords": routing.get("matched_keywords", []),
                "comment_brief": target.get("comment_brief", ""),
                "topic_signals": target.get("topic_signals", []),
                "link_policy": target.get("link_policy", "website_field_only"),
                "required_fields": target.get("required_fields", []),
                "field_hints": target.get("field_hints", {}),
                "verification": verification,
            }
        )

    ready = sum(1 for item in queue if item["status"] == "ready")
    manual_review = sum(1 for item in queue if item["status"] == "manual_review")
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "site": site_profile.get("project_name", "unknown"),
        "queue_summary": {
            "total_targets": len(queue),
            "ready": ready,
            "manual_review": manual_review,
        },
        "queue": queue,
    }


def write_markdown(report_path: Path, payload: dict[str, Any]) -> None:
    lines = [
        "# Submission Queue",
        "",
        f"- Site: {payload['site']}",
        f"- Total targets: {payload['queue_summary']['total_targets']}",
        f"- Ready: {payload['queue_summary']['ready']}",
        f"- Manual review: {payload['queue_summary']['manual_review']}",
        "",
        "| Domain | Status | Destination | Note |",
        "|--------|--------|-------------|------|",
    ]
    for item in payload["queue"]:
        if item["status"] == "ready":
            route_note = item["routing_rule_id"] or item["routing_strategy"]
            note = f"{item['comment_brief']} [{route_note}]"
        else:
            note = ", ".join(item["blocking_reasons"])
        lines.append(
            f"| {item['domain']} | {item['status']} | {item['comment_website']} | {note} |"
        )
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build a validated submission queue from site profile and targets.")
    parser.add_argument("--site-profile", required=True, help="Path to a site profile JSON file.")
    parser.add_argument("--targets", required=True, help="Path to an approved targets JSON file.")
    parser.add_argument("--output", required=True, help="Path to the queue JSON output file.")
    parser.add_argument("--report", help="Optional Markdown report path.")
    args = parser.parse_args()

    site_profile = load_json(Path(args.site_profile).resolve())
    targets = load_json(Path(args.targets).resolve())
    if not isinstance(targets, list):
        raise ValueError("Targets JSON must be a list.")

    payload = build_queue(site_profile, targets)

    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)

    if args.report:
        write_markdown(Path(args.report).resolve(), payload)

    print(json.dumps(payload["queue_summary"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
