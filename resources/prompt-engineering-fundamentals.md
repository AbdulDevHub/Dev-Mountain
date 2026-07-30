---
id: prompt-engineering-fundamentals
title: Prompt Engineering Fundamentals
sidebar_label: Prompt Engineering
description: Structured prompting, tool use protocol, and applying it to a real script.
tags: [prompt-engineering, claude, api, tool-use]
---

Notes from a 3-day self-study track: structured prompting basics, the raw
tool-use protocol, and applying both to a real script for a before/after
comparison.

---

## Day 1 — Structured Prompting Fundamentals

The core idea across all four techniques below: **make structure explicit
instead of implicit.** Don't make Claude infer what's an instruction, what's
data, or what format you want — tell it directly.

### 1. System prompts

The system prompt sets Claude's role, constraints, and behavior *before* any
user message. It's configuration, not conversation.

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    system="You are a terse code reviewer. Flag only bugs and security issues. No style comments.",
    messages=[{"role": "user", "content": "Review this function: ..."}]
)
```

**Habit to build:** put *stable* instructions (role, tone, constraints,
output format) in the system prompt. Put *variable* content (the actual
data/question) in the user message. Mixing them makes prompts harder to
reuse and test.

### 2. XML tags for structure

Claude is trained to pay close attention to XML-style tags, so they're a
reliable way to separate distinct pieces of a prompt — instructions from
data, examples from the real task, one document from another.

```
Summarize the document below in 3 bullet points.

<document>
{{long text here}}
</document>

Put your summary in <summary></summary> tags.
```

**Why it matters:** without tags, long prompts become ambiguous — is that
paragraph an instruction or content to process? Tags remove the guesswork,
and they let you reliably parse Claude's output back out programmatically
(grab everything between `<summary>` tags).

### 3. Few-shot examples

Instead of describing the output format in prose, show 2–3 input/output
pairs. Models generalize from examples more reliably than from
descriptions, especially for formatting, tone, or edge-case handling.

```
Classify the sentiment as positive, negative, or neutral.

<example>
Input: This product changed my life!
Output: positive
</example>

<example>
Input: It arrived on time.
Output: neutral
</example>

Input: {{new text}}
Output:
```

**Habit to build:** when you catch yourself writing a long paragraph
explaining *how* to format something, stop and ask: could I just show an
example instead?

### 4. Chain-of-thought

For anything requiring reasoning (math, multi-step logic, judgment calls),
explicitly ask Claude to think before answering — and give it a place to do
that thinking separate from the final answer.

```
Solve this step by step. Put your reasoning in <thinking> tags,
then your final answer in <answer> tags.

<problem>{{problem here}}</problem>
```

This isn't just "add 'think step by step.'" The tag separation matters
because it lets you strip the reasoning out before showing the user the
answer, and it stops the model from committing to an answer before it's
reasoned through the problem.

:::tip Exercise
Take a prompt you'd normally write in a single paragraph — a summarizer,
classifier, or code reviewer — and rewrite it using system prompt + XML
tags + at least one few-shot example. Compare readability and output
consistency.
:::

---

## Day 2 — Tool Use and Structured Output at the Protocol Level

Wrapper libraries (Vercel AI SDK, LangChain, etc.) hide a loop from you.
Understanding that loop at the raw API level is what's increasingly assumed
in AI-adjacent interviews — not just usage of a wrapper.

### 1. The `tool_use` protocol, raw

You define tools as JSON schemas and pass them in the request. Claude
doesn't execute anything — it tells you *which* tool it wants and *what
arguments* to call it with. You run the code, then send the result back.

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Toronto?"}]
)
```

`response.content` is a **list of blocks**, not a string. It might contain
a `text` block ("Let me check that for you") *and* a `tool_use` block:

```json
{
    "type": "tool_use",
    "id": "toolu_01A...",
    "name": "get_weather",
    "input": {"location": "Toronto", "unit": "celsius"}
}
```

`response.stop_reason` will be `"tool_use"` — that's your signal that
Claude is waiting on you, not done talking.

### 2. Executing the tool and sending the result back

This is the part wrappers hide most completely. You have to:

1. Find the `tool_use` block
2. Actually run your function with `input` as arguments
3. Send a `tool_result` message back, referencing the tool's `id`
4. Append **everything** (Claude's message + your result) to the
   conversation and call again

```python
# 1 & 2: run the actual function
tool_use_block = next(b for b in response.content if b.type == "tool_use")
result = get_weather_impl(**tool_use_block.input)  # your real function

# 3 & 4: send it back, in a new user message
messages = [
    {"role": "user", "content": "What's the weather in Toronto?"},
    {"role": "assistant", "content": response.content},  # Claude's full turn, unmodified
    {"role": "user", "content": [
        {
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": str(result)  # must be a string (or content blocks)
        }
    ]}
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=messages
)
```

:::caution Common bug
Forgetting to pass `response.content` back **unmodified** as the assistant
turn. If you strip it down to just the text part, the `tool_use_id`
reference breaks and the API rejects the next call.
:::

### 3. The multi-turn loop

Claude might need several tool calls before it can answer (look up weather
→ look up flight prices → compose an answer). Wrap the exchange in a loop
that keeps going until `stop_reason != "tool_use"`:

```python
messages = [{"role": "user", "content": "What's the weather in Toronto, and should I bring a jacket?"}]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )
    messages.append({"role": "assistant", "content": response.content})

    if response.stop_reason != "tool_use":
        break  # Claude gave a final answer

    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            result = execute_tool(block.name, block.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": str(result)
            })
    messages.append({"role": "user", "content": tool_results})

print(response.content[-1].text)  # final answer
```

Note this handles **multiple** `tool_use` blocks in one turn — Claude can
call more than one tool at once. That's a detail people miss when they've
only used a wrapper that abstracts a single call.

### 4. Forced JSON output (no "chatty" text)

Two common approaches:

**a) `tool_choice` to force a specific tool** — useful when you want
structured output *as* the tool call, not a text answer:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[extract_data_tool],
    tool_choice={"type": "tool", "name": "extract_data"},  # forces this exact tool
    messages=[{"role": "user", "content": "Extract name and age: John is 34 years old."}]
)
```

This guarantees `stop_reason == "tool_use"` and the `input` field matches
your schema — no more parsing prose to find JSON.

**b) Prefilling the assistant turn** — forces raw JSON without a tool at
all:

```python
messages = [
    {"role": "user", "content": "Return JSON with name and age for: John is 34."},
    {"role": "assistant", "content": "{"}  # prefill forces Claude to continue as JSON
]
```

Claude continues from `{` instead of starting a fresh sentence, so you get
clean JSON you can parse (remember to prepend the `{` back when parsing the
response text).

:::tip Exercise
Write a script — no SDK helpers, raw `requests` or the base `anthropic`
client with manual message handling — that defines one simple tool (e.g.
`add(a, b)`) and runs the full loop: ask a math question that requires
calling it, execute it, send the result back, print the final answer.
:::

---

## Day 3 — Applying It to a Real Script

Take something that already exists — a CLI tool, a scraper, any script that
calls Claude with a loose prompt — and rebuild the prompt using the Day 1
and Day 2 techniques. The goal is a concrete before/after comparison.

### Before: a typical loose prompt

```python
prompt = f"Extract the product name, price, and rating from this page: {html_content}"
response = client.messages.create(model="claude-sonnet-4-6", messages=[{"role": "user", "content": prompt}])
print(response.content[0].text)
```

Problems, concretely:

- Output format is unpredictable — sometimes a sentence, sometimes
  markdown, sometimes JSON-ish text you have to regex out
- No guidance on edge cases (missing price? no rating?)
- No separation between instruction and data — if the HTML contains
  something that looks like an instruction, it can confuse the model

### After: applying system prompt + XML + few-shot + forced JSON

```python
system = """You extract structured product data from raw HTML.
Only extract data that is explicitly present. Use null for missing fields.
Never guess or infer values not shown in the source."""

tools = [{
    "name": "extract_product",
    "description": "Structured product data extracted from a page",
    "input_schema": {
        "type": "object",
        "properties": {
            "name": {"type": ["string", "null"]},
            "price": {"type": ["number", "null"]},
            "rating": {"type": ["number", "null"]}
        },
        "required": ["name", "price", "rating"]
    }
}]

user_prompt = """
<examples>
<example>
<html><h1>Wireless Mouse</h1><span>$19.99</span><div>4.5 stars</div></html>
Output: {"name": "Wireless Mouse", "price": 19.99, "rating": 4.5}
</example>
<example>
<html><h1>USB Cable</h1><span>Out of stock</span></html>
Output: {"name": "USB Cable", "price": null, "rating": null}
</example>
</examples>

<page_html>
{html_content}
</page_html>

Extract the product data.
"""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=system,
    tools=tools,
    tool_choice={"type": "tool", "name": "extract_product"},
    messages=[{"role": "user", "content": user_prompt}]
)

data = response.content[0].input  # guaranteed to match your schema
```

### What changed, mapped to what you learned

| Technique | Where it shows up |
|---|---|
| System prompt | Role + hard constraint ("never guess") pulled out of the task text |
| XML tags | `<page_html>` separates data from instructions, `<examples>` separates demonstration from the real task |
| Few-shot | Shows the model exactly how to handle a missing-field case, not just the happy path |
| Forced JSON via `tool_choice` | No regex-parsing prose anymore — `input` is guaranteed structured |

---

## Quick Reference

- **System prompt** → stable role/constraints, separate from variable task content
- **XML tags** → separate instructions, data, and examples so nothing is ambiguous
- **Few-shot examples** → show format instead of describing it, especially for edge cases
- **Chain-of-thought** → give reasoning its own tagged space, separate from the final answer
- **`tool_use`** → Claude requests a tool call; you execute it and return a `tool_result`
- **Multi-turn loop** → keep exchanging messages until `stop_reason != "tool_use"`
- **`tool_choice`** → force a specific tool call to guarantee structured output
- **Prefilling** → seed the assistant turn (e.g. with `{`) to force raw JSON without a tool
