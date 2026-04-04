import { getAllPosts } from '$lib/utils/posts';

export const prerender = true;

export async function load() {
	const posts = await getAllPosts();
	const completedPaths = posts
		.filter((p) => (p.meta.tags || []).includes('completed'))
		.map((p) => {
			let section = 'software';
			if (p.meta.tags?.includes('hardware')) section = 'hardware';
			else if (p.meta.tags?.includes('outreach')) section = 'outreach';
			return `/${section}/${p.slug}`;
		});

	return {
		completedPaths
	};
}
