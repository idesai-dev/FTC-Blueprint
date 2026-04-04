import { error, json } from '@sveltejs/kit';
import { writeFileSync } from 'fs';
import { join } from 'path';

export const POST = async ({ request }) => {
	// This only works locally in dev mode
	if (process.env.NODE_ENV === 'production') {
		throw error(403, 'Forbidden');
	}

	const { slug, content } = await request.json();

	if (!slug || !content) {
		throw error(400, 'Missing slug or content');
	}

	try {
		// Calculate the path to the posts directory
		const filePath = join(process.cwd(), 'src', 'posts', `${slug}.md`);
		
		// Write the file to disk
		writeFileSync(filePath, content, 'utf-8');

		return json({ success: true, path: filePath });
	} catch (e) {
		console.error('Local save error:', e);
		throw error(500, 'Failed to save locally');
	}
};
