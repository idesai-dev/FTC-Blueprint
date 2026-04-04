import { getAllPosts } from '$lib/utils/posts';

export async function load() {
	const posts = await getAllPosts();
	return {
		recentPosts: posts.filter((p) => (p.meta.tags || []).includes('software')).slice(0, 6)
	};
}
