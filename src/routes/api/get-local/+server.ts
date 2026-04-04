import { error, json } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const GET = async ({ url }) => {
	if (process.env.NODE_ENV === 'production') {
		throw error(403, 'Forbidden');
	}

	const slug = url.searchParams.get('slug');

	if (!slug) {
		throw error(400, 'Missing slug');
	}

	try {
		const filePath = join(process.cwd(), 'src', 'posts', `${slug}.md`);
		
		if (!existsSync(filePath)) {
			throw error(404, 'File not found');
		}

		const content = readFileSync(filePath, 'utf-8');

		return json({ success: true, content });
	} catch (e) {
		console.error('Local get error:', e);
		throw error(500, 'Failed to read locally');
	}
};
