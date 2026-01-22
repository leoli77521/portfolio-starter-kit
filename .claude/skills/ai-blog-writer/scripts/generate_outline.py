#!/usr/bin/env python3
"""
Blog Post Outline Generator for tolearn.blog
Generates a structured outline based on topic and post type.
"""

import sys
import json
from datetime import datetime

def generate_tutorial_outline(topic: str, difficulty: str = "intermediate") -> str:
    """Generate a tutorial post outline."""
    return f"""# How to {topic}: A Step-by-Step Guide

*Reading time: ~8 minutes | Difficulty: {difficulty.capitalize()}*

## Introduction
- Hook: [Problem statement that resonates with reader]
- Promise: What reader will achieve by the end
- Prerequisites: [List 2-3 requirements]

## Step 1: [Setup/Foundation]
- Explanation of first step
- Code example
- Expected output

## Step 2: [Core Implementation]
- Main implementation details
- Code with inline comments
- Pro tip callout

## Step 3: [Enhancement/Polish]
- Additional features
- Error handling
- Best practices

## Common Issues
- Issue 1 + Solution
- Issue 2 + Solution

## Conclusion
- Summary of key points
- Next steps / CTA
- Related posts to link

---
Generated: {datetime.now().strftime('%Y-%m-%d')}
Topic: {topic}
Type: Tutorial
"""

def generate_comparison_outline(item_a: str, item_b: str) -> str:
    """Generate a comparison post outline."""
    return f"""# {item_a} vs {item_b}: Which Should You Choose?

## Quick Summary
- TL;DR recommendation
- Comparison table (4-5 key features)

## {item_a} Overview
- What it is
- Pros (3 points)
- Cons (2 points)
- Best use cases

## {item_b} Overview
- What it is
- Pros (3 points)
- Cons (2 points)
- Best use cases

## Head-to-Head Comparison
- Feature 1: [Winner]
- Feature 2: [Winner]
- Feature 3: [Winner]
- Pricing: [Comparison]

## My Recommendation
- Choose {item_a} if: [conditions]
- Choose {item_b} if: [conditions]

## Conclusion
- Final thoughts
- CTA

---
Generated: {datetime.now().strftime('%Y-%m-%d')}
Type: Comparison
"""

def generate_explainer_outline(concept: str) -> str:
    """Generate an explainer post outline."""
    return f"""# What is {concept}? A Beginner's Guide

## Simple Explanation
- One sentence definition
- Everyday analogy
- Why it matters

## How {concept} Works
- Step 1 of the process
- Step 2 of the process
- Step 3 of the process
- [Diagram placeholder]

## Real-World Examples
- Example 1: [Use case]
- Example 2: [Use case]

## Common Misconceptions
- Myth vs Reality #1
- Myth vs Reality #2

## Getting Started
- First steps for beginners
- Recommended resources

## Conclusion
- Key takeaway
- Related topics to explore

---
Generated: {datetime.now().strftime('%Y-%m-%d')}
Topic: {concept}
Type: Explainer
"""

def generate_list_outline(topic: str, count: int = 7) -> str:
    """Generate a listicle/roundup post outline."""
    items = "\n".join([f"## {i}. [Item Name]\n- Best for: [use case]\n- Key feature: [highlight]\n- Code example or screenshot\n" for i in range(1, count + 1)])
    
    return f"""# {count} Best {topic} in {datetime.now().year}

## Quick Picks
- Best overall: [Item]
- Best for beginners: [Item]
- Best value: [Item]

{items}

## How I Evaluated
- Criterion 1
- Criterion 2
- Criterion 3

## Conclusion
- Summary
- Final recommendation
- CTA

---
Generated: {datetime.now().strftime('%Y-%m-%d')}
Topic: {topic}
Type: List/Roundup
Count: {count}
"""

def main():
    if len(sys.argv) < 3:
        print("Usage: python generate_outline.py <type> <topic> [options]")
        print("Types: tutorial, comparison, explainer, list")
        print("Examples:")
        print('  python generate_outline.py tutorial "Build a Chatbot with Claude"')
        print('  python generate_outline.py comparison "Claude" "GPT-4"')
        print('  python generate_outline.py explainer "Prompt Engineering"')
        print('  python generate_outline.py list "AI Coding Tools" 10')
        sys.exit(1)
    
    post_type = sys.argv[1].lower()
    topic = sys.argv[2]
    
    if post_type == "tutorial":
        difficulty = sys.argv[3] if len(sys.argv) > 3 else "intermediate"
        outline = generate_tutorial_outline(topic, difficulty)
    elif post_type == "comparison":
        if len(sys.argv) < 4:
            print("Comparison requires two items: python generate_outline.py comparison 'Item A' 'Item B'")
            sys.exit(1)
        outline = generate_comparison_outline(topic, sys.argv[3])
    elif post_type == "explainer":
        outline = generate_explainer_outline(topic)
    elif post_type == "list":
        count = int(sys.argv[3]) if len(sys.argv) > 3 else 7
        outline = generate_list_outline(topic, count)
    else:
        print(f"Unknown type: {post_type}")
        print("Valid types: tutorial, comparison, explainer, list")
        sys.exit(1)
    
    print(outline)

if __name__ == "__main__":
    main()
