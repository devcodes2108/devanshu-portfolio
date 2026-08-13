#!/usr/bin/env python3
"""
LinkedIn data sync script for the portfolio.

This script processes LinkedIn post data and updates data/linkedin-import.ts.
It is designed to be run locally or in a GitHub Actions workflow.

Usage:
    python scripts/sync-linkedin.py <input.json>

Where <input.json> is a JSON array of LinkedIn posts in the format:
[
  {
    "id": "string",
    "title": "string",
    "text": "string",
    "excerpt": "string",
    "date": "YYYY-MM-DD",
    "url": "string",
    "images": ["url1", "url2"],
    "imageAlt": "string",
    "hashtags": ["#tag1", "#tag2"],
    "reactions": number | null,
    "comments": number | null,
    "impressions": number | null,
    "mediaType": "image" | "video" | "document" | "certificate" | "text",
    "category": "technical" | "career" | "event" | "resource" | "certification" | "insight" | "documentation"
  }
]

The script will:
1. Load existing posts from data/linkedin-import.ts
2. Merge new posts (deduplicated by URL and ID)
3. Apply exclusion filters
4. Sort by date (newest first)
5. Write back to data/linkedin-import.ts
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime
from collections import Counter


# Exclusion rules matching the portfolio's existing filters
EXCLUDE_MEDIA_TYPES = {"certificate", "document", "video"}
EXCLUDE_CATEGORIES = {"certification", "documentation"}
EXCLUDE_KEYWORDS = [
    "certificate",
    "certification",
    "certified",
    "document",
    "pdf",
    "video",
    "webinar recording",
]


def should_exclude(post: dict) -> tuple[bool, str | None]:
    """Check if a post should be excluded based on filters."""
    media_type = post.get("mediaType", "").lower()
    category = post.get("category", "").lower()
    text = (post.get("text", "") + " " + post.get("title", "")).lower()

    if media_type in EXCLUDE_MEDIA_TYPES:
        return True, f"mediaType={media_type}"

    if category in EXCLUDE_CATEGORIES:
        return True, f"category={category}"

    for keyword in EXCLUDE_KEYWORDS:
        if keyword in text:
            return True, f"keyword={keyword}"

    return False, None


def load_existing_posts(filepath: Path) -> tuple[list[dict], str]:
    """Load existing posts from linkedin-import.ts."""
    content = filepath.read_text(encoding="utf-8")

    # Extract the rawLinkedInPosts array
    match = re.search(
        r"export const rawLinkedInPosts: LinkedInPost\[\] = \[(.*?)\];",
        content,
        re.DOTALL,
    )
    if not match:
        return [], content

    array_content = match.group(1)

    # Parse individual posts
    posts = []
    post_pattern = re.compile(
        r'\{\s*id:\s*"([^"]+)".*?(?=\n\s*\}|\Z)',
        re.DOTALL,
    )

    for post_match in post_pattern.finditer(array_content):
        post_block = post_match.group(0)
        post_id = post_match.group(1)

        # Extract fields
        post = {"id": post_id}

        field_patterns = {
            "title": r'title:\s*"([^"]*)"',
            "date": r'date:\s*"([^"]*)"',
            "url": r'url:\s*"([^"]*)"',
            "text": r'text:\s*"([^"]*)"',
            "excerpt": r'excerpt:\s*"([^"]*)"',
            "imageAlt": r'imageAlt:\s*"([^"]*)"',
            "mediaType": r'mediaType:\s*"([^"]*)"',
            "category": r'category:\s*"([^"]*)"',
            "exclusionReason": r'exclusionReason:\s*"([^"]*)"',
            "source": r'source:\s*"([^"]*)"',
        }

        for field, pattern in field_patterns.items():
            field_match = re.search(pattern, post_block)
            if field_match:
                post[field] = field_match.group(1)

        # Extract arrays
        images_match = re.search(r"images:\s*\[(.*?)\]", post_block, re.DOTALL)
        if images_match:
            images_str = images_match.group(1)
            images = re.findall(r'"([^"]+)"', images_str)
            post["images"] = images
        else:
            post["images"] = []

        hashtags_match = re.search(r"hashtags:\s*\[(.*?)\]", post_block, re.DOTALL)
        if hashtags_match:
            hashtags_str = hashtags_match.group(1)
            hashtags = re.findall(r'"([^"]+)"', hashtags_str)
            post["hashtags"] = hashtags
        else:
            post["hashtags"] = []

        # Extract numbers
        for num_field in ["reactions", "comments", "impressions"]:
            num_match = re.search(rf"{num_field}:\s*(\d+|null)", post_block)
            if num_match:
                val = num_match.group(1)
                post[num_field] = int(val) if val != "null" else None

        # Extract boolean
        included_match = re.search(r"included:\s*(true|false)", post_block)
        if included_match:
            post["included"] = included_match.group(1) == "true"

        posts.append(post)

    return posts, content


def merge_posts(existing: list[dict], new_posts: list[dict]) -> list[dict]:
    """Merge new posts with existing posts, deduplicating by URL and ID."""
    existing_by_url = {p["url"]: p for p in existing if p.get("url")}
    existing_by_id = {p["id"]: p for p in existing}

    merged = list(existing)

    for post in new_posts:
        url = post.get("url", "")
        post_id = post.get("id", "")

        # Skip if URL already exists
        if url and url in existing_by_url:
            continue

        # Skip if ID already exists
        if post_id and post_id in existing_by_id:
            continue

        # Apply exclusion filters
        excluded, reason = should_exclude(post)
        post["included"] = not excluded
        post["exclusionReason"] = reason if excluded else None
        post["source"] = "agent-reach"

        merged.append(post)

    return merged


def sort_posts(posts: list[dict]) -> list[dict]:
    """Sort posts by date descending (newest first)."""
    def get_sort_key(post):
        date_str = post.get("date", "")
        try:
            return datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return datetime.min

    return sorted(posts, key=get_sort_key, reverse=True)


def format_post_typescript(post: dict, indent: str = "    ") -> str:
    """Format a single post as TypeScript."""
    lines = [f"{indent}{{"]

    # Simple fields
    simple_fields = [
        "id", "title", "date", "url", "text", "excerpt",
        "imageAlt", "mediaType", "category", "exclusionReason", "source",
    ]
    for field in simple_fields:
        if field in post and post[field] is not None:
            value = post[field]
            if isinstance(value, str):
                # Escape special characters for TypeScript strings
                value = value.replace("\\", "\\\\").replace('"', '\\"')
                value = value.replace("\n", "\\n").replace("\r", "\\r")
                lines.append(f'{indent}  {field}: "{value}",')
            else:
                lines.append(f'{indent}  {field}: {value},')

    # Boolean
    if "included" in post:
        lines.append(f'{indent}  included: {"true" if post["included"] else "false"},')

    # Arrays
    if "images" in post:
        images_str = ", ".join(f'"{img}"' for img in post["images"])
        lines.append(f"{indent}  images: [{images_str}],")

    if "hashtags" in post:
        hashtags_str = ", ".join(f'"{tag}"' for tag in post["hashtags"])
        lines.append(f"{indent}  hashtags: [{hashtags_str}],")

    # Numbers
    for num_field in ["reactions", "comments", "impressions"]:
        if num_field in post:
            val = post[num_field]
            lines.append(f"{indent}  {num_field}: {val if val is not None else 'null'},")

    lines.append(f"{indent}}},")
    return "\n".join(lines)


def write_posts_file(filepath: Path, posts: list[dict], original_content: str):
    """Write posts back to linkedin-import.ts, preserving the file structure."""
    # Find the array boundaries
    array_start_match = re.search(
        r"export const rawLinkedInPosts: LinkedInPost\[\] = \[",
        original_content,
    )
    array_end_match = re.search(r"\n\];\n\nexport const linkedinProfile", original_content)

    if not array_start_match or not array_end_match:
        raise ValueError("Could not find array boundaries in linkedin-import.ts")

    prefix = original_content[:array_start_match.end()]
    suffix = original_content[array_end_match.start():]

    # Format all posts
    posts_str = "\n".join(format_post_typescript(post) for post in posts)

    new_content = f"{prefix}\n{posts_str}\n{suffix}"
    filepath.write_text(new_content, encoding="utf-8")


def main():
    if len(sys.argv) < 2:
        print("Usage: python sync-linkedin.py <input.json> [--verify]")
        print("\n<input.json> should be a JSON array of LinkedIn posts.")
        print("Use --verify to check data integrity without making changes.")
        sys.exit(1)

    input_file = sys.argv[1]
    verify_only = "--verify" in sys.argv

    if verify_only:
        print("Running verification only...")
        portfolio_root = Path(__file__).parent.parent
        linkedin_file = portfolio_root / "data" / "linkedin-import.ts"

        if not linkedin_file.exists():
            print(f"Error: {linkedin_file} does not exist.")
            sys.exit(1)

        existing_posts, _ = load_existing_posts(linkedin_file)
        included = [p for p in existing_posts if p.get("included", True)]
        excluded = [p for p in existing_posts if not p.get("included", True)]

        print(f"Total posts: {len(existing_posts)}")
        print(f"Included: {len(included)}")
        print(f"Excluded: {len(excluded)}")

        if excluded:
            print("\nExcluded posts:")
            for post in excluded:
                reason = post.get("exclusionReason", "unknown")
                print(f"  - {post.get('title', post['id'])} ({reason})")

        # Check for duplicates
        urls = [p["url"] for p in existing_posts if p.get("url")]
        ids = [p["id"] for p in existing_posts]
        url_dupes = [url for url, count in Counter(urls).items() if count > 1]
        id_dupes = [id for id, count in Counter(ids).items() if count > 1]

        if url_dupes:
            print(f"\nWARNING: Duplicate URLs found: {url_dupes}")
        if id_dupes:
            print(f"\nWARNING: Duplicate IDs found: {id_dupes}")

        print("\nVerification complete!")
        sys.exit(0)

    input_path = Path(input_file)
    if not input_path.exists():
        print(f"Error: Input file {input_path} does not exist.")
        sys.exit(1)

    # Load new posts
    print(f"Loading posts from {input_path}...")
    with open(input_path, "r", encoding="utf-8") as f:
        new_posts = json.load(f)

    print(f"Loaded {len(new_posts)} new posts.")

    # Load existing posts
    portfolio_root = Path(__file__).parent.parent
    linkedin_file = portfolio_root / "data" / "linkedin-import.ts"

    if not linkedin_file.exists():
        print(f"Error: {linkedin_file} does not exist.")
        sys.exit(1)

    existing_posts, original_content = load_existing_posts(linkedin_file)
    print(f"Found {len(existing_posts)} existing posts.")

    # Count exclusions
    excluded_count = sum(1 for p in existing_posts if not p.get("included", True))
    print(f"Existing excluded posts: {excluded_count}")

    # Merge
    merged_posts = merge_posts(existing_posts, new_posts)
    new_count = len(merged_posts) - len(existing_posts)
    print(f"Added {new_count} new posts.")

    # Sort by date descending
    sorted_posts = sort_posts(merged_posts)

    # Write back
    write_posts_file(linkedin_file, sorted_posts, original_content)
    print(f"Updated {linkedin_file}")

    # Summary
    included = [p for p in sorted_posts if p.get("included", True)]
    excluded = [p for p in sorted_posts if not p.get("included", True)]

    print("\n=== Sync Summary ===")
    print(f"Total posts: {len(sorted_posts)}")
    print(f"Included: {len(included)}")
    print(f"Excluded: {len(excluded)}")

    if excluded:
        print("\nExcluded posts:")
        for post in excluded:
            reason = post.get("exclusionReason", "unknown")
            print(f"  - {post.get('title', post['id'])} ({reason})")

    print("\nSync complete!")


if __name__ == "__main__":
    main()
