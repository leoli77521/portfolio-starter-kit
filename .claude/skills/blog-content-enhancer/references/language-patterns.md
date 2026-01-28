# Language Patterns

语言优化模式和表达转换指南。

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
```markdown
- What's more, ...
- On top of that, ...
- Here's another thing: ...
- Plus, ...
- And here's the kicker: ...
- Better yet, ...
```

### Contrast (Opposing ideas)
```markdown
- That said, ...
- But here's the catch: ...
- On the flip side, ...
- However, ...
- The tradeoff? ...
- But wait— ...
```

### Cause/Effect
```markdown
- Because of this, ...
- This means ...
- The result? ...
- So what happens? ...
- This leads to ...
- Here's why that matters: ...
```

### Example/Illustration
```markdown
- Take [X] for instance: ...
- Here's a real example: ...
- Case in point: ...
- Let me show you: ...
- Consider this: ...
- Picture this: ...
```

### Sequence
```markdown
- First up, ...
- Next, ...
- Then comes ...
- Finally, ...
- The first step? ...
- Once that's done, ...
```

### Conclusion/Summary
```markdown
- The bottom line: ...
- So what does this mean? ...
- Here's the takeaway: ...
- In short: ...
- Let's wrap up: ...
- What does this all add up to? ...
```

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
```markdown
- "Think of [technical term] like [familiar concept]."
- "[Technical term] is basically [simple explanation]."
- "If [familiar thing] is X, then [technical term] is Y."
```

### Examples

| Technical | Approachable |
|-----------|--------------|
| "Implements the observer pattern" | "Watches for changes and reacts automatically" |
| "Leverages lazy evaluation" | "Only does work when it actually needs the result" |
| "Utilizes memoization" | "Remembers previous calculations to avoid redoing them" |

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
**For urgency:** now, immediately, today
**For value:** essential, proven, powerful
**For ease:** simple, quick, effortless
**For results:** boost, transform, unlock

---

## Common Mistakes to Avoid

### Weak Phrases
| Avoid | Use Instead |
|-------|-------------|
| "I think that..." | [Just state it] |
| "It seems like..." | [Be direct] |
| "In order to..." | "To..." |
| "Due to the fact that..." | "Because..." |
| "At this point in time..." | "Now..." |

### Redundancies
| Redundant | Clean |
|-----------|-------|
| "Completely eliminate" | "Eliminate" |
| "Basic fundamentals" | "Fundamentals" |
| "End result" | "Result" |
| "Past history" | "History" |
| "Future plans" | "Plans" |

### Filler Words to Cut
- Actually
- Basically
- Really
- Very
- Just (when unnecessary)
- Quite
- Rather
- Simply (when not emphasizing simplicity)

---

## Quality Checklist

Before finalizing language edits:

- [ ] Active voice predominates (>80%)
- [ ] Sentences vary in length (mix short and long)
- [ ] Technical terms are explained on first use
- [ ] Transitions connect paragraphs smoothly
- [ ] "You" appears more often than "one" or passive constructs
- [ ] Filler words eliminated
- [ ] Redundancies removed
- [ ] Tone is consistent throughout
