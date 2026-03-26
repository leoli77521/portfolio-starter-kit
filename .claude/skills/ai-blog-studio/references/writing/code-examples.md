# Code Examples Best Practices

Guidelines for writing clear, educational code examples.

---

## Core Principles

### 1. Explain Before Showing

**Wrong approach:**
```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
```
This creates a message using Claude API.

**Right approach:**
Here's how to send your first message to Claude. We're using the Sonnet model and limiting the response to 1024 tokens:

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",  # Fast, capable model
    max_tokens=1024,                    # Limit response length
    messages=[{"role": "user", "content": "Hello!"}]
)
```

---

### 2. Always Specify Language

**Do:**
```python
print("Hello, world!")
```

```javascript
console.log("Hello, world!");
```

**Don't:**
```
print("Hello, world!")
```

---

### 3. Include Inline Comments

Comments should explain the "why", not the "what":

```python
from anthropic import Anthropic

# Initialize the client (uses ANTHROPIC_API_KEY env var by default)
client = Anthropic()

# Create a conversation with Claude
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    # System prompt sets Claude's behavior for the entire conversation
    system="You are a helpful coding assistant.",
    messages=[
        {"role": "user", "content": "Explain recursion in one sentence."}
    ]
)

# The response content is a list; get the first text block
print(response.content[0].text)
```

---

### 4. Show Complete, Runnable Examples

**Incomplete (bad):**
```python
# ... setup code ...
response = client.messages.create(...)
```

**Complete (good):**
```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.content[0].text)
```

---

### 5. Use Realistic Variable Names

**Bad:**
```python
x = Anthropic()
y = x.messages.create(...)
print(y.content[0].text)
```

**Good:**
```python
client = Anthropic()
response = client.messages.create(...)
print(response.content[0].text)
```

---

## Formatting Guidelines

### Break Long Code Into Chunks

Instead of one massive block, break it up with explanations:

**Step 1: Initialize the client**
```python
from anthropic import Anthropic

client = Anthropic()
```

**Step 2: Define your system prompt**
```python
system_prompt = """You are a helpful coding assistant.
When explaining code, use simple language and provide examples."""
```

**Step 3: Send the message**
```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    system=system_prompt,
    messages=[{"role": "user", "content": "What is a Python decorator?"}]
)
```

---

### Show Expected Output

```python
print(response.content[0].text)
```

**Output:**
```
A Python decorator is a function that modifies the behavior of another function...
```

---

### Handle Errors in Examples

Show realistic error handling:

```python
from anthropic import Anthropic, APIError

client = Anthropic()

try:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response.content[0].text)
except APIError as e:
    print(f"API error: {e}")
```

---

## Language-Specific Tips

### Python
- Use f-strings for formatting
- Include type hints in complex examples
- Show both sync and async versions when relevant

```python
# Sync version
response = client.messages.create(...)

# Async version
response = await client.messages.create(...)
```

### JavaScript/TypeScript
- Use modern ES6+ syntax
- Show both CommonJS and ESM imports when relevant
- Include TypeScript types for complex objects

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(response.content[0].text);
```

### Shell/Bash
- Include the prompt symbol
- Show expected output

```bash
$ pip install anthropic
Successfully installed anthropic-0.39.0

$ export ANTHROPIC_API_KEY="your-key-here"
```

---

## Code Block Callouts

Use callouts to highlight important lines:

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello!"},
        {"role": "assistant", "content": "Hi there!"},
        {"role": "user", "content": "How are you?"}  # <- Multi-turn conversation
    ]
)
```

> **Note the pattern:** Each message alternates between "user" and "assistant" roles.

---

## Common Patterns

### API Request/Response
```python
# Request
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)

# Response structure
print(f"Model: {response.model}")
print(f"Stop reason: {response.stop_reason}")
print(f"Usage: {response.usage.input_tokens} in, {response.usage.output_tokens} out")
print(f"Content: {response.content[0].text}")
```

### Configuration Pattern
```python
# Good: Configuration at the top
MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 1024
SYSTEM_PROMPT = "You are a helpful assistant."

# Usage
response = client.messages.create(
    model=MODEL,
    max_tokens=MAX_TOKENS,
    system=SYSTEM_PROMPT,
    messages=[{"role": "user", "content": user_input}]
)
```

### Streaming Pattern
```python
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Tell me a story."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

---

## Quality Checklist

Before including code:

- [ ] Language is specified in code block
- [ ] Code is complete and runnable
- [ ] Variables have meaningful names
- [ ] Comments explain non-obvious parts
- [ ] Code is explained BEFORE it appears
- [ ] Expected output is shown when helpful
- [ ] Error handling is included where appropriate
- [ ] Code follows the language's conventions
