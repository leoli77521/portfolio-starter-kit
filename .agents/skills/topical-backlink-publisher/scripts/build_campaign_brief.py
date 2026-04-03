#!/usr/bin/env python3
"""Build a topical backlink campaign brief from a blog post or manual inputs."""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "how",
    "in",
    "into",
    "is",
    "it",
    "its",
    "of",
    "on",
    "or",
    "that",
    "the",
    "their",
    "this",
    "to",
    "use",
    "why",
    "with",
}


def default_site_profile() -> Path:
    return Path(__file__).resolve().parents[2] / "backlink-auto-publisher" / "assets" / "tolearn-site-profile.json"


def default_campaign_profile() -> Path:
    return Path(__file__).resolve().parents[1] / "assets" / "tolearn-backlink-campaign-profile.json"


def default_registry() -> Path:
    return Path(__file__).resolve().parents[1] / "assets" / "backlink-type-registry.json"


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def parse_frontmatter(post_path: Path) -> dict[str, Any]:
    text = post_path.read_text(encoding="utf-8")
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not match:
        raise ValueError(f"No frontmatter found in {post_path}")
    payload: dict[str, Any] = {}
    for raw_line in match.group(1).splitlines():
        line = raw_line.strip()
        if not line or ":" not in line:
            continue
        key, value = line.split(":", 1)
        cleaned = value.strip()
        if (cleaned.startswith('"') and cleaned.endswith('"')) or (
            cleaned.startswith("'") and cleaned.endswith("'")
        ):
            cleaned = cleaned[1:-1]
        payload[key.strip()] = cleaned
    if not payload:
        raise ValueError(f"Invalid frontmatter in {post_path}")
    return payload


def parse_tags(value: Any) -> list[str]:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if isinstance(value, str):
        trimmed = value.strip()
        if trimmed.startswith("[") and trimmed.endswith("]"):
            try:
                parsed = json.loads(trimmed)
                if isinstance(parsed, list):
                    return [str(item).strip() for item in parsed if str(item).strip()]
            except json.JSONDecodeError:
                pass
        return [item.strip() for item in trimmed.split(",") if item.strip()]
    return []


def normalize_text(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def collect_keywords(title: str, summary: str, tags: list[str], slug: str, core_topics: list[str]) -> list[str]:
    keywords: list[str] = []

    def add_keyword(value: str) -> None:
        cleaned = value.strip()
        if not cleaned:
            return
        if cleaned.lower() not in {item.lower() for item in keywords}:
            keywords.append(cleaned)

    for tag in tags:
        add_keyword(tag)

    for phrase in core_topics:
        if normalize_text(phrase) and normalize_text(phrase) in normalize_text(f"{title} {summary} {' '.join(tags)} {slug}"):
            add_keyword(phrase)

    token_source = f"{title} {summary} {slug.replace('-', ' ')}"
    for token in normalize_text(token_source).split():
        if len(token) < 4 or token in STOPWORDS:
            continue
        add_keyword(token)

    return keywords[:18]


def build_talking_points(title: str, tags: list[str], destination_url: str) -> list[str]:
    primary_tags = ", ".join(tags[:3]) if tags else "the main topic"
    return [
        f"Reference one specific point from the target page before mentioning {title}.",
        f"Keep the extension grounded in {primary_tags}.",
        f"Use the website field for {destination_url} instead of dropping the URL into the comment body.",
    ]


def active_backlink_types(registry: list[dict[str, Any]]) -> list[str]:
    return [entry["id"] for entry in registry if entry.get("status") == "active" and entry.get("id")]


def write_markdown(report_path: Path, payload: dict[str, Any]) -> None:
    lines = [
        "# Backlink Campaign Brief",
        "",
        f"- Title: {payload['title']}",
        f"- Destination URL: {payload['destination_url']}",
        f"- Destination scope: {payload['destination_scope']}",
        f"- Active backlink types: {', '.join(payload['active_backlink_types']) or 'none'}",
        "",
        "## Keywords",
    ]
    for keyword in payload["keywords"]:
        lines.append(f"- {keyword}")
    lines.extend(["", "## Talking Points"])
    for point in payload["talking_points"]:
        lines.append(f"- {point}")
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build a topical backlink campaign brief.")
    parser.add_argument("--post", help="Path to an MDX post file.")
    parser.add_argument("--title", help="Manual title when no post path is supplied.")
    parser.add_argument("--summary", help="Manual summary when no post path is supplied.")
    parser.add_argument("--tags", help="Comma-separated tags when no post path is supplied.")
    parser.add_argument("--destination-url", help="Explicit destination URL override.")
    parser.add_argument("--site-profile", default=str(default_site_profile()), help="Path to the site profile JSON.")
    parser.add_argument("--campaign-profile", default=str(default_campaign_profile()), help="Path to the campaign profile JSON.")
    parser.add_argument("--registry", default=str(default_registry()), help="Path to the backlink type registry JSON.")
    parser.add_argument("--output", required=True, help="Path to the output JSON file.")
    parser.add_argument("--report", help="Optional Markdown report path.")
    args = parser.parse_args()

    site_profile = load_json(Path(args.site_profile).resolve())
    campaign_profile = load_json(Path(args.campaign_profile).resolve())
    registry = load_json(Path(args.registry).resolve())

    if args.post:
        post_path = Path(args.post).resolve()
        frontmatter = parse_frontmatter(post_path)
        title = str(frontmatter.get("title", "")).strip()
        summary = str(frontmatter.get("summary", "")).strip()
        tags = parse_tags(frontmatter.get("tags", []))
        slug = post_path.stem
        destination_url = args.destination_url or f"{site_profile.get('site_url', '').rstrip('/')}/blog/{slug}"
        source = "post"
    else:
        title = (args.title or "").strip()
        summary = (args.summary or "").strip()
        tags = parse_tags(args.tags or "")
        slug = normalize_text(title).replace(" ", "-")
        destination_url = args.destination_url or site_profile.get("site_url", "")
        source = "manual"

    if not title:
        raise ValueError("A title is required. Supply --post or --title.")

    core_topics = campaign_profile.get("core_topics", [])
    keywords = collect_keywords(title, summary, tags, slug, core_topics if isinstance(core_topics, list) else [])
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": source,
        "title": title,
        "summary": summary,
        "tags": tags,
        "slug": slug,
        "destination_url": destination_url,
        "destination_scope": "article" if source == "post" else "manual",
        "site_url": site_profile.get("site_url", ""),
        "keywords": keywords,
        "active_backlink_types": active_backlink_types(registry if isinstance(registry, list) else []),
        "comment_guardrails": campaign_profile.get("comment_guardrails", {}),
        "talking_points": build_talking_points(title, tags, destination_url),
    }

    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)

    if args.report:
        write_markdown(Path(args.report).resolve(), payload)

    print(
        json.dumps(
            {
                "title": payload["title"],
                "destination_url": payload["destination_url"],
                "keyword_count": len(payload["keywords"]),
                "active_backlink_types": payload["active_backlink_types"],
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
