import { error, json } from '@sveltejs/kit';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

function parseFrontmatter(raw: string): Record<string, unknown> {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return {};
	const fm: Record<string, unknown> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const colonIdx = line.indexOf(':');
		if (colonIdx === -1) continue;
		const key = line.slice(0, colonIdx).trim();
		let val: unknown = line.slice(colonIdx + 1).trim();
		// tags array
		if (typeof val === 'string' && val.startsWith('[')) {
			val = val
				.replace(/^\[|\]$/g, '')
				.split(',')
				.map((s) => s.trim().replace(/^["']|["']$/g, ''))
				.filter(Boolean);
		} else if (val === 'true') {
			val = true;
		} else if (val === 'false') {
			val = false;
		}
		fm[key] = val;
	}
	return fm;
}

export const GET = async () => {
	if (process.env.NODE_ENV === 'production') {
		throw error(403, 'Forbidden');
	}

	try {
		const postsDir = join(process.cwd(), 'src', 'posts');
		const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));

		const posts = files.map((file) => {
			const slug = file.replace(/\.md$/, '');
			const raw = readFileSync(join(postsDir, file), 'utf-8');
			const meta = parseFrontmatter(raw);
			return { slug, meta };
		});

		// Sort by date descending
		posts.sort((a, b) => {
			const da = String(a.meta.date ?? '');
			const db = String(b.meta.date ?? '');
			return db.localeCompare(da);
		});

		return json({ posts });
	} catch (e) {
		console.error('list-posts error:', e);
		throw error(500, 'Failed to list posts');
	}
};
