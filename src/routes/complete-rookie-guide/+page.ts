import { error } from '@sveltejs/kit';

export async function load() {
	try {
		// @ts-ignore - The markdown file is handled by mdsvex and Vite, so TS doesn't recognize it
		const post = await import('../../posts/complete-rookie-guide.md');
		if (!post.metadata || !post.metadata.title) {
			throw error(404, `Post "complete-rookie-guide" not found`);
		}
		return {
			content: post.default,
			meta: post.metadata
		};
	} catch (e) {
		throw error(404, `Post "complete-rookie-guide" not found`);
	}
}
