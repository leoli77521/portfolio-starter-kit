#!/usr/bin/env python3
"""
SEO Checker for Blog Posts
Analyzes a markdown file for SEO best practices.
"""

import sys
import re
from pathlib import Path

def check_title(content: str) -> list:
    """Check title SEO."""
    issues = []
    
    # Find H1 title
    h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if not h1_match:
        issues.append("❌ Missing H1 title")
        return issues
    
    title = h1_match.group(1)
    title_len = len(title)
    
    if title_len < 30:
        issues.append(f"⚠️ Title too short ({title_len} chars). Aim for 50-60 characters.")
    elif title_len > 60:
        issues.append(f"⚠️ Title too long ({title_len} chars). May be truncated in search results. Aim for 50-60.")
    else:
        issues.append(f"✅ Title length good ({title_len} chars)")
    
    # Check for power words
    power_words = ['how', 'why', 'what', 'guide', 'tutorial', 'best', 'top', 'ultimate', 'complete', 'easy', 'quick', 'simple']
    has_power_word = any(word in title.lower() for word in power_words)
    if has_power_word:
        issues.append("✅ Title contains power words")
    else:
        issues.append("⚠️ Consider adding power words (How, Why, Guide, Best, etc.)")
    
    return issues

def check_headings(content: str) -> list:
    """Check heading structure."""
    issues = []
    
    h1_count = len(re.findall(r'^#\s+', content, re.MULTILINE))
    h2_count = len(re.findall(r'^##\s+', content, re.MULTILINE))
    h3_count = len(re.findall(r'^###\s+', content, re.MULTILINE))
    
    if h1_count != 1:
        issues.append(f"❌ Should have exactly 1 H1, found {h1_count}")
    else:
        issues.append("✅ Single H1 heading")
    
    if h2_count < 3:
        issues.append(f"⚠️ Only {h2_count} H2 headings. Consider adding more sections.")
    else:
        issues.append(f"✅ Good number of H2 headings ({h2_count})")
    
    return issues

def check_content_length(content: str) -> list:
    """Check content length."""
    issues = []
    
    # Remove code blocks for word count
    text_only = re.sub(r'```[\s\S]*?```', '', content)
    words = len(text_only.split())
    
    if words < 500:
        issues.append(f"⚠️ Content may be too short ({words} words). Aim for 800+ for tutorials.")
    elif words < 800:
        issues.append(f"⚠️ Content is brief ({words} words). Consider expanding for better SEO.")
    elif words > 3000:
        issues.append(f"⚠️ Content is very long ({words} words). Consider splitting into series.")
    else:
        issues.append(f"✅ Good content length ({words} words)")
    
    # Estimate reading time
    reading_time = words // 200
    issues.append(f"📖 Estimated reading time: {reading_time} minutes")
    
    return issues

def check_code_blocks(content: str) -> list:
    """Check code examples."""
    issues = []
    
    code_blocks = re.findall(r'```(\w*)\n', content)
    
    if not code_blocks:
        issues.append("⚠️ No code blocks found. Technical posts should include examples.")
    else:
        issues.append(f"✅ Found {len(code_blocks)} code block(s)")
        
        # Check for language specification
        unspecified = [b for b in code_blocks if not b]
        if unspecified:
            issues.append(f"⚠️ {len(unspecified)} code block(s) without language specified")
    
    return issues

def check_links(content: str) -> list:
    """Check links."""
    issues = []
    
    # Find markdown links
    links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
    
    if not links:
        issues.append("⚠️ No links found. Add internal/external links.")
    else:
        internal = [l for l in links if 'tolearn.blog' in l[1] or l[1].startswith('/') or l[1].startswith('#')]
        external = [l for l in links if l not in internal]
        
        if len(internal) < 2:
            issues.append(f"⚠️ Only {len(internal)} internal link(s). Aim for 2-3 per post.")
        else:
            issues.append(f"✅ Good internal linking ({len(internal)} links)")
        
        issues.append(f"📎 External links: {len(external)}")
    
    # Check for "click here" anti-pattern
    bad_anchors = [l for l in links if l[0].lower() in ['click here', 'here', 'link', 'this']]
    if bad_anchors:
        issues.append("⚠️ Avoid generic anchor text like 'click here'. Use descriptive text.")
    
    return issues

def check_images(content: str) -> list:
    """Check image usage."""
    issues = []
    
    images = re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', content)
    
    if not images:
        issues.append("⚠️ No images found. Consider adding screenshots or diagrams.")
    else:
        issues.append(f"✅ Found {len(images)} image(s)")
        
        # Check alt text
        no_alt = [img for img in images if not img[0]]
        if no_alt:
            issues.append(f"❌ {len(no_alt)} image(s) missing alt text")
    
    return issues

def check_meta(content: str) -> list:
    """Check for meta elements."""
    issues = []
    
    # Check for frontmatter
    if content.startswith('---'):
        issues.append("✅ Has frontmatter/metadata")
    else:
        issues.append("⚠️ Consider adding frontmatter for meta description")
    
    # Check for call to action
    cta_patterns = ['subscribe', 'comment', 'share', 'follow', 'check out', 'let me know', 'drop a']
    has_cta = any(pattern in content.lower() for pattern in cta_patterns)
    if has_cta:
        issues.append("✅ Has call-to-action")
    else:
        issues.append("⚠️ Add a call-to-action (comment, share, etc.)")
    
    return issues

def analyze_post(filepath: str) -> None:
    """Run all SEO checks on a blog post."""
    try:
        content = Path(filepath).read_text(encoding='utf-8')
    except FileNotFoundError:
        print(f"Error: File not found: {filepath}")
        sys.exit(1)
    
    print(f"\n📊 SEO Analysis: {filepath}\n")
    print("=" * 50)
    
    checks = [
        ("TITLE", check_title),
        ("HEADINGS", check_headings),
        ("CONTENT LENGTH", check_content_length),
        ("CODE EXAMPLES", check_code_blocks),
        ("LINKS", check_links),
        ("IMAGES", check_images),
        ("META & CTA", check_meta),
    ]
    
    for name, check_fn in checks:
        print(f"\n### {name}")
        for issue in check_fn(content):
            print(f"  {issue}")
    
    print("\n" + "=" * 50)
    print("Analysis complete!\n")

def main():
    if len(sys.argv) < 2:
        print("Usage: python seo_check.py <markdown_file>")
        print("Example: python seo_check.py my-blog-post.md")
        sys.exit(1)
    
    analyze_post(sys.argv[1])

if __name__ == "__main__":
    main()
