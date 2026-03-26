# Writing Style Guide

Voice, tone, and language patterns for tolearn.blog.

---

## Voice Examples

### ❌ Too Formal (Avoid)
"This documentation will provide a comprehensive overview of the implementation methodology for integrating Claude API into your application infrastructure."

### ✅ Conversational (Preferred)
"Let me show you how to get Claude API up and running in your app. It's easier than you might think."

---

### ❌ Too Casual (Avoid)
"Yo, so like, Claude API is super cool and stuff, gonna show ya how to use it lol"

### ✅ Friendly but Professional (Preferred)
"Claude API is impressive, and today I'll walk you through everything you need to start building with it."

---

## Introduction Examples

### ❌ Weak Opening
"In this article, I will discuss the Claude API. The Claude API is made by Anthropic. It can be used for many things."

### ✅ Strong Opening
"Picture this: you're building a chatbot, and you want it to actually understand context—not just spit out generic responses. That's exactly where Claude API shines, and I'm going to show you how to harness it."

---

## Explaining Technical Concepts

### ❌ Too Technical
"The API utilizes a RESTful architecture with JSON payload serialization, implementing OAuth 2.0 bearer token authentication via HTTP Authorization headers."

### ✅ Accessible Technical
"To talk to Claude, your code sends a message (in JSON format) to Anthropic's servers. Think of it like texting—you send a message, wait a moment, and get a reply. The API key is like your phone number; it tells Anthropic who's calling."

---

## Code Explanations

### ❌ Explain After Code
```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
```
This code creates a message using the Claude API with the Sonnet model and a max of 1024 tokens.

### ✅ Explain Before Code
Here's how to send your first message to Claude. We're using the Sonnet model (fast and capable) and limiting the response to 1024 tokens:

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",  # Fast, capable model
    max_tokens=1024,                    # Limit response length
    messages=[{"role": "user", "content": "Hello!"}]
)
```

---

## Formal → Conversational Conversions

### Opening Phrases

| Formal | Conversational |
|--------|----------------|
| "It is important to note that..." | "Here's the key thing:" |
| "This article will discuss..." | "Let's dive into..." |
| "The purpose of this guide is..." | "In this guide, you'll learn..." |
| "One should consider..." | "Think about this:" |
| "It is worth mentioning..." | "Worth noting:" |

### Explanation Phrases

| Formal | Conversational |
|--------|----------------|
| "This enables users to..." | "This lets you..." |
| "The implementation demonstrates..." | "This shows how..." |
| "Subsequently, one must..." | "Next, you'll need to..." |
| "The aforementioned approach..." | "This approach..." |
| "As previously stated..." | "Like I mentioned..." |

### Conclusion Phrases

| Formal | Conversational |
|--------|----------------|
| "In conclusion, it can be stated..." | "The bottom line:" |
| "To summarize the key points..." | "Here's what matters:" |
| "It is recommended that..." | "My recommendation:" |
| "The findings suggest..." | "What this tells us:" |

---

## Passive → Active Voice

### Patterns

| Passive | Active |
|---------|--------|
| "The code was written by..." | "[Person] wrote the code..." |
| "Errors are thrown when..." | "The system throws errors when..." |
| "The data is processed by the API..." | "The API processes the data..." |
| "It should be noted that..." | "Note that..." |
| "The feature was introduced in..." | "[Company] introduced this feature in..." |

### Detection Tips
Look for:
- "was/were + past participle" (was written, were created)
- "is/are + past participle" (is processed, are handled)
- "by" phrases indicating the actor
- Vague subjects ("it", "there")

---

## Transition Phrases

### Addition (Adding information)
- What's more, ...
- On top of that, ...
- Here's another thing: ...
- Plus, ...
- Better yet, ...

### Contrast (Opposing ideas)
- That said, ...
- But here's the catch: ...
- On the flip side, ...
- The tradeoff? ...
- But wait— ...

### Cause/Effect
- Because of this, ...
- This means ...
- The result? ...
- Here's why that matters: ...

### Example/Illustration
- Take [X] for instance: ...
- Here's a real example: ...
- Case in point: ...
- Picture this: ...

### Sequence
- First up, ...
- Next, ...
- Then comes ...
- Finally, ...
- Once that's done, ...

### Conclusion/Summary
- The bottom line: ...
- So what does this mean? ...
- Here's the takeaway: ...
- Let's wrap up: ...

---

## Sentence Variety

### Length Mixing

**Monotonous:**
```
AI models process data. They analyze patterns. They generate outputs. Users review results.
```

**Varied:**
```
AI models process vast amounts of data, analyzing patterns that humans might miss.
The outputs? Often surprising. Users review these results to verify accuracy.
```

### Structure Patterns

| Pattern | Example |
|---------|---------|
| Statement + Question | "This approach works well. But what about edge cases?" |
| Short + Long | "Simple. Yet the implications are profound." |
| List + Elaboration | "Three things matter here: speed, accuracy, and cost. Let's break each down." |
| Question + Answer | "Why does this matter? Because it changes everything." |

---

## Technical Jargon Handling

### Introduce, Then Use
```markdown
**First mention:**
"Machine Learning (ML)—the practice of training computers to learn from data—powers most modern AI applications."

**Subsequent uses:**
"Once your ML model is trained..."
```

### Analogy Patterns
- "Think of [technical term] like [familiar concept]."
- "[Technical term] is basically [simple explanation]."
- "If [familiar thing] is X, then [technical term] is Y."

### Examples

| Technical | Approachable |
|-----------|--------------|
| "Implements the observer pattern" | "Watches for changes and reacts automatically" |
| "Leverages lazy evaluation" | "Only does work when it actually needs the result" |
| "Utilizes memoization" | "Remembers previous calculations to avoid redoing them" |

---

## Common Phrases to Avoid

| Instead of | Use |
|------------|-----|
| "It should be noted that" | "Note:" or just state it |
| "In order to" | "To" |
| "At this point in time" | "Now" |
| "Due to the fact that" | "Because" |
| "In the event that" | "If" |
| "Utilize" | "Use" |
| "Implement" | "Build" or "Create" |
| "Leverage" | "Use" |
| "Functionality" | "Feature" |

### Redundancies to Cut

| Redundant | Clean |
|-----------|-------|
| "Completely eliminate" | "Eliminate" |
| "Basic fundamentals" | "Fundamentals" |
| "End result" | "Result" |
| "Past history" | "History" |
| "Future plans" | "Plans" |

### Filler Words to Remove
- Actually, Basically, Really, Very
- Just (when unnecessary)
- Quite, Rather
- Simply (when not emphasizing simplicity)

---

## Engagement Techniques

### Direct Address
- Use "you" and "your" frequently
- Ask rhetorical questions
- Use imperative mood for instructions

### Concrete Over Abstract
| Abstract | Concrete |
|----------|----------|
| "Significant performance improvements" | "3x faster response times" |
| "Various use cases" | "Email automation, data analysis, code review" |
| "In the near future" | "By Q2 2026" |

### Power Words
- **For urgency:** now, immediately, today
- **For value:** essential, proven, powerful
- **For ease:** simple, quick, effortless
- **For results:** boost, transform, unlock

---

## Paragraph Length

Keep paragraphs to 3-4 sentences max. Each paragraph should cover one idea.

Break up long explanations with:
- Subheadings
- Bullet points
- Code examples
- Images or diagrams

White space is your friend. Online readers scan—make it easy for them.

---

## Calls to Action

### End of Tutorial
- "Now it's your turn. Try building [simple project] using what you've learned."
- "Got questions? Drop them in the comments—I read every one."
- "If this helped you, share it with a developer friend who might be stuck on the same problem."

### Mid-Article Engagement
- "> **Quick exercise:** Before reading on, try predicting what this code will output."
- "Pause here and make sure your setup matches mine before continuing."

---

## Formatting Tips

### Use Bold for Key Terms
"The **system prompt** is where you tell Claude how to behave. Think of it as the **personality instructions** for your AI."

### Use Callout Boxes
```markdown
> **Pro tip:** Always test your prompts with edge cases before deploying.

> **Warning:** This will overwrite existing data without confirmation.

> **Note:** API keys should never be committed to version control.
```

### Use Lists for Steps, Prose for Explanations
**Do this for sequential steps:**
1. Install the package
2. Set your API key
3. Make your first request

**But use prose for explanations:**
"The API processes your request in three stages. First, it validates your authentication. Then, it sends your message to the model. Finally, it streams the response back to your application."

---

## Quality Checklist

Before finalizing:

- [ ] Active voice predominates (>80%)
- [ ] Sentences vary in length (mix short and long)
- [ ] Technical terms are explained on first use
- [ ] Transitions connect paragraphs smoothly
- [ ] "You" appears more often than "one" or passive constructs
- [ ] Filler words eliminated
- [ ] Redundancies removed
- [ ] Tone is consistent throughout

---

## Remember

1. **Write like you're explaining to a smart friend** who just hasn't learned this yet
2. **Front-load value**—don't make readers wait for the good stuff
3. **Be specific**—vague advice is useless
4. **Show, don't just tell**—code examples beat descriptions
5. **Respect the reader's time**—every sentence should earn its place
