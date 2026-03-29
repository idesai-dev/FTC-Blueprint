const n=`---\r
title: Writing in Markdown — A Quick Reference\r
date: 2026-03-20\r
description: A practical guide to markdown syntax — headings, code blocks, tables, blockquotes, and more.\r
tags: [markdown, beginner, formatting]\r
author: Blueprint\r
published: true\r
---\r
\r
# Writing in Markdown — A Quick Reference\r
\r
Markdown is plain text that renders as formatted HTML. It's fast to write, beginner to read, and version-control friendly. Here's a reference for everything you need.\r
\r
## Headers\r
\r
Headers consist of information that is not shown to the public user, but instead used by the server to extract some custom information about the page before it rendered. Examples could be to store descriptions, date modified, author, and more. Lets take for instance the header of this page:\r
\r
\`\`\`markdown\r
---\r
title: Writing in Markdown — A Quick Reference\r
date: 2026-03-20\r
description: A practical guide to markdown syntax — headings, code blocks, tables, blockquotes, and more.\r
tags: [markdown, beginner, formatting]\r
author: Blueprint\r
published: true\r
---\r
\`\`\`\r
\r
## Headings\r
\r
\`\`\`markdown\r
# H1 — Page title\r
\r
## H2 — Section\r
\r
### H3 — Subsection\r
\r
#### H4 — Detail\r
\`\`\`\r
\r
## Text Formatting\r
\r
| Syntax              | Result            |\r
| ------------------- | ----------------- |\r
| \`**bold**\`          | **bold**          |\r
| \`*italic*\`          | _italic_          |\r
| \`\` \`inline code\` \`\` | \`inline code\`     |\r
| \`~~strikethrough~~\` | ~~strikethrough~~ |\r
\r
## Lists\r
\r
**Unordered:**\r
\r
\`\`\`code\r
- Item one\r
- Item two\r
  - Nested item\r
  - Another nested item\r
\r
\`\`\`\r
\r
which renders as:\r
\r
- Item one\r
- Item two\r
  - Nested item\r
  - Another nested item\r
\r
**Ordered:**\r
\r
\`\`\`code\r
1. First step\r
2. Second step\r
3. Third step\r
\`\`\`\r
\r
which renders as:\r
\r
1. First step\r
2. Second step\r
3. Third step\r
\r
## Code Blocks\r
\r
Code can be represented as code blocks, or as inline code. For inline code, visit the table above. For code blocks, you need to enclose the code in triple backticks. Here is an example of how to do it:\r
\r
\`\`\`\`code\r
\`\`\`java\r
public static void main(String[] args) {\r
    System.out.println("Hello, World!");\r
}\r
\`\`\`\r
\`\`\`\`\r
\r
which renders as:\r
\r
\`\`\`java\r
public static void main(String[] args) {\r
    System.out.println("Hello, World!");\r
}\r
\`\`\`\r
\r
Fenced code blocks with language tags support syntax highlighting:\r
\r
\`\`\`javascript\r
function greet(name) {\r
	return \`Hello, \${name}!\`;\r
}\r
\r
console.log(greet('World'));\r
\`\`\`\r
\r
\`\`\`python\r
def fibonacci(n):\r
    if n <= 1:\r
        return n\r
    return fibonacci(n - 1) + fibonacci(n - 2)\r
\`\`\`\r
\r
## Blockquotes\r
\r
\`\`\`code\r
> "The best writing is rewriting."\r
> — E.B. White\r
\`\`\`\r
\r
which renders as:\r
\r
> "The best writing is rewriting."\r
> — E.B. White\r
\r
Blockquotes are useful for callouts, quotes, or emphasis.\r
\r
## Links and Images\r
\r
\`\`\`markdown\r
[Link text](https://example.com)\r
![Alt text](./image.png)\r
\`\`\`\r
\r
## Horizontal Rules\r
\r
Use \`---\` to create a thematic break:\r
\r
---\r
\r
## Tables\r
\r
\`\`\`markdown\r
| Column A | Column B | Column C |\r
| -------- | -------- | -------- |\r
| Cell 1   | Cell 2   | Cell 3   |\r
| Cell 4   | Cell 5   | Cell 6   |\r
\`\`\`\r
\r
Renders as:\r
\r
| Column A | Column B | Column C |\r
| -------- | -------- | -------- |\r
| Cell 1   | Cell 2   | Cell 3   |\r
| Cell 4   | Cell 5   | Cell 6   |\r
\r
---\r
\r
That covers 95% of what you'll ever need. Now go write something.\r
`;export{n as default};
