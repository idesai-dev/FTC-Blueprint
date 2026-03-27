---
title: Welcome to Blueprint
date: 2026-03-26
description: An introduction to this blog — what it is, why it exists, and where it's heading.
tags: [meta, intro]
author: Blueprint
published: true
---

# Welcome to Blueprint

This is the first post on **Blueprint** — a minimal, fast, and focused blog built with SvelteKit and powered by plain markdown files.

## Why Another Blog?

Good question. The short answer: writing is thinking made visible. Having a place to document ideas, experiments, and lessons learned forces clarity. Blueprint is that place.

## What You'll Find Here

- **Engineering breakdowns** — deep-dives into how things are built
- **Robotics & embedded systems** — the physical side of software
- **Short essays** — ideas worth exploring

## How It's Built

The entire site is built with [SvelteKit](https://kit.svelte.dev) — a full-stack framework built around Svelte. Posts are written in markdown and processed through **MDsveX**, which compiles `.md` files into Svelte components at build time.

```ts
// A post loads like this:
const post = await import(`../../../posts/${params.slug}.md`);
return {
  content: post.default,
  meta: post.metadata
};
```

The result is blazing-fast static pages with zero JavaScript runtime cost per post.

## Adding Your Own Posts

Drop any `.md` file into `src/posts/` with this frontmatter:

```markdown
---
title: My Post Title
date: 2026-03-26
description: Describe what the post is about.
tags: [svelte, web]
author: Your Name
published: true
---
```

The route `/blog/my-post-title` will be live automatically.

---

That's it for now. Stay tuned — more posts are on the way.
