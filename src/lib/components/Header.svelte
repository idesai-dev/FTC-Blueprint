<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from './ThemeToggle.svelte';
	import { cursorState, toggleCursor } from '$lib/stores/cursor.svelte';
	import { goto } from '$app/navigation';

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/software', label: 'Software' },
		{ href: '/hardware', label: 'Hardware' },
		{ href: '/outreach', label: 'Outreach' },
		{ href: '/about', label: 'About' }
	];

	let menuOpen = $state(false);
	let searchQuery = $state('');

	function closeMenu() {
		menuOpen = false;
	}

	function handleSearch(e: KeyboardEvent) {
		if (e.key === 'Enter' && searchQuery.trim()) {
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
			searchQuery = '';
		}
	}
</script>

<header class="header" class:scrolled={false}>
	<div class="inner container container--wide">
		<a href="/" class="logo" onclick={closeMenu}>
			<span class="logo-mark">⬡</span>
			<span class="logo-text">Blueprint</span>
		</a>

		<nav class="nav" class:open={menuOpen} aria-label="Main navigation">
			{#each navLinks as { href, label }}
				<a
					{href}
					class="nav-link"
					class:active={$page.url.pathname === href || ($page.url.pathname.startsWith('/software') && href === '/software')}
					onclick={closeMenu}
				>
					{label}
				</a>
			{/each}
		</nav>

		<div class="actions">
			<div class="header-search-wrap">
				<svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
				</svg>
				<input 
					type="text" 
					placeholder="Global Search..." 
					bind:value={searchQuery}
					onkeydown={handleSearch}
					class="header-search-input" 
				/>
			</div>

			<button 
				class="action-btn cursor-toggle" 
				class:active={cursorState.active}
				onclick={toggleCursor}
				title="Toggle Custom Cursor"
			>
				{#if cursorState.active}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
					</svg>
				{:else}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/>
					</svg>
				{/if}
			</button>

			<ThemeToggle />
			
			<button
				class="menu-btn"
				aria-label="Toggle menu"
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<span class="bar" class:open={menuOpen}></span>
				<span class="bar" class:open={menuOpen}></span>
				<span class="bar" class:open={menuOpen}></span>
			</button>
		</div>
	</div>
</header>

<!-- Mobile backdrop -->
{#if menuOpen}
	<div
		class="backdrop"
		role="button"
		tabindex="-1"
		aria-label="Close menu"
		onclick={closeMenu}
		onkeydown={(e) => e.key === 'Enter' && closeMenu()}
	></div>
{/if}

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		height: var(--header-height);
		background: rgba(21, 21, 21, 0.82);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--border-subtle);
		transition: background var(--transition-slow), border-color var(--transition-slow);
	}

	:global(html.light) .header {
		background: rgba(240, 246, 248, 0.88);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		gap: 1rem;
	}

	/* Logo */
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--text-primary);
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 1.15rem;
		letter-spacing: -0.02em;
		transition: opacity var(--transition-fast);
	}

	.logo:hover { opacity: 0.8; color: var(--text-primary); }

	.logo-mark {
		font-size: 1.4rem;
		background: var(--gradient-accent);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1;
	}

	/* Nav */
	.nav {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.nav-link {
		position: relative;
		padding: 0.4em 0.85em;
		border-radius: var(--radius-sm);
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color var(--transition-fast), background var(--transition-fast);
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 2px;
		left: 50%;
		transform: translateX(-50%) scaleX(0);
		width: 16px;
		height: 2px;
		background: var(--gradient-accent);
		border-radius: 2px;
		transition: transform var(--transition-base);
	}

	.nav-link:hover {
		color: var(--text-primary);
		background: rgba(116, 215, 237, 0.06);
	}

	.nav-link.active {
		color: var(--text-primary);
	}

	.nav-link.active::after {
		transform: translateX(-50%) scaleX(1);
	}

	/* Actions */
	.actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header-search-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.header-search-wrap .search-icon {
		position: absolute;
		left: 0.75rem;
		color: var(--text-muted);
		pointer-events: none;
	}

	.header-search-input {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		padding: 0.45rem 1rem 0.45rem 2.2rem;
		font-size: 0.85rem;
		color: var(--text-primary);
		width: 160px;
		transition: all var(--transition-base);
		outline: none;
	}

	.header-search-input:focus {
		width: 240px;
		border-color: var(--text-primary);
		box-shadow: var(--glow-cyan);
	}

	.action-btn {
		width: 38px;
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.action-btn:hover {
		border-color: var(--text-primary);
		color: var(--text-primary);
		background: var(--bg-card-hover);
	}

	.action-btn.active {
		background: var(--accent-cyan-dim);
		border-color: var(--text-primary);
		color: var(--text-primary);
	}

	/* Mobile menu button */
	.menu-btn {
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		width: 38px;
		height: 38px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		cursor: pointer;
		padding: 0;
	}

	.bar {
		display: block;
		width: 18px;
		height: 2px;
		background: var(--text-primary);
		border-radius: 2px;
		transition: transform var(--transition-base), opacity var(--transition-base);
	}

	.bar.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
	.bar.open:nth-child(2) { opacity: 0; }
	.bar.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 99;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.menu-btn { display: flex; }

		.nav {
			position: fixed;
			top: var(--header-height);
			right: 0;
			z-index: 100;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
			width: 220px;
			padding: 1rem;
			background: var(--bg-secondary);
			border-left: 1px solid var(--border);
			border-bottom: 1px solid var(--border);
			border-radius: 0 0 0 var(--radius-lg);
			transform: translateX(100%);
			transition: transform var(--transition-base);
		}

		.nav.open {
			transform: translateX(0);
		}

		.nav-link {
			width: 100%;
			padding: 0.6em 0.75em;
		}
	}
</style>
