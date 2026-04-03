<script lang="ts">
    import { page } from '$app/stores';

    const groups = [
        {
            title: "Drivetrain",
            links: [
                { href: "/hardware/hardware-drivetrain-overview", label: "Drivetrain Overview" },
                { href: "/hardware/hardware-mecanum-wheels", label: "Mecanum Wheels" },
                { href: "/hardware/hardware-tank-drive", label: "Tank Drive" }
            ]
        },
        {
            title: "Mechanisms",
            links: [
                { href: "/hardware/hardware-linear-slides", label: "Linear Slides" },
                { href: "/hardware/hardware-arms", label: "Arms" },
                { href: "/hardware/hardware-intakes", label: "Intakes" },
                { href: "/hardware/hardware-claws", label: "Claws & End Effectors" }
            ]
        },
        {
            title: "Electronics",
            links: [
                { href: "/hardware/hardware-control-hub", label: "Control Hub" },
                { href: "/hardware/hardware-motors-servos-guide", label: "Motors & Servos Guide" },
                { href: "/hardware/hardware-wiring-best-practices", label: "Wiring Best Practices" }
            ]
        },
        {
            title: "CAD & Design",
            links: [
                { href: "/hardware/hardware-cad-intro", label: "CAD Introduction" },
                { href: "/hardware/hardware-design-principles", label: "Design Principles" }
            ]
        }
    ];

    let currentPath = $derived($page.url.pathname);

    let activeGroup = $derived(groups.find((group) =>
        group.links.some((link) => link.href === currentPath)
    ));
</script>

{#if activeGroup}
    <nav class="left-sidebar" aria-label="Section navigation">
        <p class="sidebar-label">{activeGroup.title}</p>
        <ul class="sidebar-list">
            {#each activeGroup.links as { href, label }}
                <li class="sidebar-item">
                    <a
                        {href}
                        class="sidebar-link"
                        class:active={currentPath === href}
                    >
                        {label}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
{/if}

<style>
    .left-sidebar {
        position: sticky;
        top: calc(var(--header-height) + 2rem);
        width: 200px;
        flex-shrink: 0;
        max-height: calc(100vh - var(--header-height) - 4rem);
        overflow-y: auto;
        padding-left: 0.5rem;
        border-right: 1px solid var(--border-subtle);

        scrollbar-width: thin;
        scrollbar-color: var(--border) transparent;
    }

    .sidebar-label {
        font-size: 0.8rem;
        font-family: var(--font-body);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        padding-right: 1rem;
    }

    .sidebar-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-right: 1rem;
    }

    .sidebar-item {
        display: block;
    }

    .sidebar-link {
        display: block;
        font-size: 0.82rem;
        font-family: var(--font-body);
        color: var(--text-muted);
        text-decoration: none;
        border-radius: var(--radius-sm);
        padding: 0.35rem 0.5rem;
        transition:
            color var(--transition-fast),
            background-color var(--transition-fast);
        line-height: 1.4;
    }

    .sidebar-link:hover {
        color: var(--text-primary);
        background: rgba(116, 215, 237, 0.05);
    }

    .sidebar-link.active {
        color: var(--accent-green);
        background: rgba(126, 255, 160, 0.07);
        font-weight: 500;
    }

    @media (max-width: 1100px) {
        .left-sidebar {
            display: none;
        }
    }
</style>
