<svelte:head>
	<title>About — Blueprint</title>
	<meta
		name="description"
		content="Learn more about Blueprint, the writer, and the ideas behind the blog."
	/>
</svelte:head>

<section class="about-header">
	<div class="container">
		<div class="animate-fade-up" style="display:inline-block">
			<span class="tag tag--green">About</span>
		</div>
		<h1 class="animate-fade-up" style="animation-delay:60ms">Meet the Chuds.</h1>
	</div>
</section>

<section class="about-body">
	<div class="container">
		<div class="about-grid animate-fade-up" style="animation-delay:120ms">
			<div class="about-main prose-like">
				<h2>Hello there 👋</h2>
				<p>
					Welcome to <strong>Blueprint</strong> — a digital notebook for FTC, engineering, and more!
				</p>

				<p>
					Check out our <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube channel!</a>
				</p>

				<pre class="code-block"><code
						>---
title: My Post Title
date: 2026-03-26
description: A short summary of the post.
tags: [tag1, tag2]
author: Your Name
published: true
---

Your content here...
</code></pre>

			</div>

			<aside class="about-sidebar">
				<div class="sidebar-card">
					<div class="sidebar-icon">⬡</div>
					<h4>The Chuds <br> (FTC Team 12345)</h4>
					<p> Based in Austin, Texas</p>
					<div class="sidebar-links">
						<a href="/articles" class="sidebar-link">
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
								><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline
									points="14 2 14 8 20 8"
								/></svg
							>
							Read the articles
						</a>
					</div>
				</div>

				<div class="sidebar-card sidebar-card--muted">
					<h4>The Idea</h4>
					<ul class="stack-list">
						<li><span class="tag tag--cyan">Clairity</span></li>
						<li><span class="tag tag--green">Simplicity</span></li>
						<li><span class="tag tag--yellow">Results</span></li>
					</ul>
				</div>
			</aside>
		</div>
	</div>
</section>

<style>
	.about-header {
		padding: 4rem 0 2rem;
		background: var(--gradient-hero);
		border-bottom: 1px solid var(--border-subtle);
	}

	.about-header .container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.about-body {
		padding: 3rem 0 6rem;
	}

	.about-grid {
		display: grid;
		grid-template-columns: 1fr 260px;
		gap: 3rem;
		align-items: start;
	}

	@media (max-width: 720px) {
		.about-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	/* Prose-like styles for about */
	.prose-like h2 {
		font-size: 1.6rem;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	.prose-like h3 {
		font-size: 1.1rem;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		color: var(--text-primary);
	}

	.prose-like p {
		color: var(--text-body);
		line-height: 1.8;
		margin-bottom: 1.2rem;
	}

	.prose-like a {
		color: var(--text-primary);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.prose-like a:hover {
		color: var(--accent-green);
	}

	.prose-like strong {
		color: var(--text-primary);
	}

	.prose-like ul {
		padding-left: 1.5rem;
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.prose-like li {
		color: var(--text-body);
		line-height: 1.6;
	}

	.prose-like li::marker {
		color: var(--accent-green);
	}

	.prose-like code {
		font-family: var(--font-mono);
		font-size: 0.87em;
		padding: 0.15em 0.45em;
		background: rgba(116, 215, 237, 0.08);
		border: 1px solid rgba(116, 215, 237, 0.15);
		border-radius: var(--radius-sm);
		color: var(--accent-green);
	}

	.code-block {
		background: #111111;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 1.25rem 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.7;
		color: var(--text-body);
		overflow-x: auto;
		margin: 1.25rem 0;
	}

	.code-block code {
		background: none;
		border: none;
		padding: 0;
		font-size: inherit;
		color: inherit;
	}

	/* Sidebar */
	.about-sidebar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sidebar-card {
		background: var(--gradient-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		transition: border-color var(--transition-base);
	}

	.sidebar-card:hover {
		border-color: var(--text-primary);
	}

	.sidebar-card--muted {
		background: var(--bg-card);
	}

	.sidebar-icon {
		font-size: 2rem;
		background: var(--gradient-accent);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1;
	}

	.sidebar-card h4 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.sidebar-card p {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.sidebar-links {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: 0.25rem;
	}

	.sidebar-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-primary);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.sidebar-link:hover {
		color: var(--accent-green);
	}

	.stack-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
</style>
