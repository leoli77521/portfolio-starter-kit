# Writing Style Examples for tolearn.blog

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

## Transition Sentences

### Between Sections
- "Now that we've covered the basics, let's dive into..."
- "With that foundation in place, here's where it gets interesting..."
- "But wait—there's more to consider..."
- "Before we move on, there's one thing worth noting..."

### Building on Previous Points
- "Building on that idea..."
- "This connects to what we discussed earlier..."
- "Here's why this matters for..."

---

## Calls to Action

### End of Tutorial
- "Now it's your turn. Try building [simple project] using what you've learned."
- "Got questions? Drop them in the comments—I read every one."
- "If this helped you, share it with a developer friend who might be stuck on the same problem."

### Mid-Article Engagement
- "💡 Quick exercise: Before reading on, try predicting what this code will output."
- "Pause here and make sure your setup matches mine before continuing."

---

## Formatting Tips

### Use Bold for Key Terms
"The **system prompt** is where you tell Claude how to behave. Think of it as the **personality instructions** for your AI."

### Use Callout Boxes
```markdown
> 💡 **Pro tip:** Always test your prompts with edge cases before deploying.

> ⚠️ **Warning:** This will overwrite existing data without confirmation.

> 📝 **Note:** API keys should never be committed to version control.
```

### Use Lists for Steps, Prose for Explanations
**Do this for sequential steps:**
1. Install the package
2. Set your API key
3. Make your first request

**But use prose for explanations:**
"The API processes your request in three stages. First, it validates your authentication. Then, it sends your message to the model. Finally, it streams the response back to your application."

---

## Common Phrases to Use

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

---

## Paragraph Length

### ❌ Too Long
[Imagine a 200-word paragraph here]

### ✅ Digestible
Keep paragraphs to 3-4 sentences max. Each paragraph should cover one idea.

Break up long explanations with:
- Subheadings
- Bullet points
- Code examples
- Images or diagrams

White space is your friend. Online readers scan—make it easy for them.

---

## Example Full Intro

### Topic: Getting Started with Claude API

---

**Weak version:**

In this blog post, I will be discussing how to use the Claude API. The Claude API is an artificial intelligence API created by Anthropic. It allows developers to integrate AI into their applications. This guide will cover the basics of using the API including setup, authentication, and making requests.

---

**Strong version:**

I still remember the first time I got Claude to respond to my code—there's something magical about watching an AI engage in actual conversation through an API you built.

If you've been curious about adding AI capabilities to your projects but felt intimidated by the setup, I've got good news: getting started with Claude API is surprisingly straightforward.

In the next 10 minutes, you'll go from zero to having a working AI integration. We'll cover:
- Setting up your environment (2 minutes)
- Making your first API call (3 minutes)
- Handling responses like a pro (5 minutes)

Let's build something cool.

---

## Remember

1. **Write like you're explaining to a smart friend** who just hasn't learned this yet
2. **Front-load value**—don't make readers wait for the good stuff
3. **Be specific**—vague advice is useless
4. **Show, don't just tell**—code examples beat descriptions
5. **Respect the reader's time**—every sentence should earn its place
