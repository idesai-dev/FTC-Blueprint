---
title: Writing in Markdown — A Quick Reference
date: 2026-03-20
description: A practical guide to markdown syntax — headings, code blocks, tables, blockquotes, and more.
tags: [markdown, writing, reference]
author: Blueprint
published: true
---

# Writing in Markdown — A Quick Reference

Markdown is plain text that renders as formatted HTML. It's fast to write, easy to read, and version-control friendly. Here's a reference for everything you need.

## Headings

```markdown
# H1 — Page title
## H2 — Section
### H3 — Subsection
#### H4 — Detail
```

## Text Formatting

| Syntax | Result |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `` `inline code` `` | `inline code` |
| `~~strikethrough~~` | ~~strikethrough~~ |

## Lists

**Unordered:**
- Item one
- Item two
  - Nested item
  - Another nested item

**Ordered:**
1. First step
2. Second step
3. Third step

## Code Blocks

Fenced code blocks with language tags support syntax highlighting:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

## Blockquotes

> "The best writing is rewriting."
> — E.B. White

Blockquotes are useful for callouts, quotes, or emphasis.

## Links and Images

```markdown
[Link text](https://example.com)
![Alt text](./image.png)
```

## Horizontal Rules

Use `---` to create a thematic break:

---

## Tables

```markdown
| Column A | Column B | Column C |
|---|---|---|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

Renders as:

| Column A | Column B | Column C |
|---|---|---|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

---

That covers 95% of what you'll ever need. Now go write something.
