import re
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Add showLink definition if not exists
    if 'const showLink' not in content:
        content = re.sub(
            r'(const visiblePosts = \$derived\()',
            r'''const completedSlugs = $derived(data.posts.filter((p) => (p.meta.tags || []).includes('completed')).map((p) => p.slug));
	const showLink = (href) => devModeState.active || completedSlugs.includes(href.split('/').pop());

	\1''',
            content
        )

    # Wrap <li> around <a> with {#if showLink(...)}
    def repl_li(m):
        full_li = m.group(0)
        href = m.group(1)
        # Avoid wrapping if already wrapped
        if '{#if showLink' in full_li:
            return full_li
        # Only wrap if href is a relative link starting with /software, /hardware, /outreach
        if href.startswith('/software/') or href.startswith('/hardware/') or href.startswith('/outreach/'):
            return f'{{#if showLink("{href}")}}\n\t\t\t\t{full_li}\n\t\t\t{{/if}}'
        return full_li

    content = re.sub(r'<li[^>]*>\s*<a href="([^"]+)".*?</a>\s*</li>', repl_li, content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(content)

process_file('src/routes/software/+page.svelte')
process_file('src/routes/hardware/+page.svelte')
process_file('src/routes/outreach/+page.svelte')

