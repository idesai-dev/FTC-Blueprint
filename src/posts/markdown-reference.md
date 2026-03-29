---
title: Writing in Markdown — A Quick Reference
date: 2026-03-20
description: A practical guide to markdown syntax — headings, code blocks, tables, blockquotes, and more.
tags: [software, beginner]
author: Blueprint
published: true
---

# Writing in Markdown — A Quick Reference

Markdown is plain text that renders as formatted HTML. It's fast to write, beginner to read, and version-control friendly. Here's a reference for everything you need.

## Headers

Headers consist of information that is not shown to the public user, but instead used by the server to extract some custom information about the page before it rendered. Examples could be to store descriptions, date modified, author, and more. Lets take for instance the header of this page:

```markdown
---
title: Writing in Markdown — A Quick Reference
date: 2026-03-20
description: A practical guide to markdown syntax — headings, code blocks, tables, blockquotes, and more.
tags: [markdown, beginner, formatting]
author: Blueprint
published: true
---
```

## Headings

```markdown
# H1 — Page title

## H2 — Section

### H3 — Subsection

#### H4 — Detail
```

## Text Formatting

| Syntax              | Result            |
| ------------------- | ----------------- |
| `**bold**`          | **bold**          |
| `*italic*`          | _italic_          |
| `` `inline code` `` | `inline code`     |
| `~~strikethrough~~` | ~~strikethrough~~ |

## Lists

**Unordered:**

```code
- Item one
- Item two
  - Nested item
  - Another nested item

```

which renders as:

- Item one
- Item two
  - Nested item
  - Another nested item

**Ordered:**

```code
1. First step
2. Second step
3. Third step
```

which renders as:

1. First step
2. Second step
3. Third step

## Code Blocks

Code can be represented as code blocks, or as inline code. For inline code, visit the table above. For code blocks, you need to enclose the code in triple backticks. Here is an example of how to do it:

````code
```java
public static void main(String[] args) {
    System.out.println("Hello, World!");
}
```
````

which renders as:

```java
public static void main(String[] args) {
    System.out.println("Hello, World!");
}
```

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

```code
> "The best writing is rewriting."
> — E.B. White
```

which renders as:

> "The best writing is rewriting."
> — E.B. White

Blockquotes are useful for callouts, quotes, or emphasis.

## Links and Images

```markdown
[Link text](https://example.com)
![Alt text](/assets/markdown/image.png)
```

![md logo](/assets/markdown/images.png)

## Horizontal Rules

Use `---` to create a thematic break:

---

## Tables

```markdown
| Column A | Column B | Column C |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

Renders as:

| Column A | Column B | Column C |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

---

That covers 95% of what you'll ever need. Now go write something.
