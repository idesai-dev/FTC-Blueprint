import { getAllPosts } from '$lib/utils/posts';

export async function load() {
	const posts = await getAllPosts();
	const completedCount = posts.filter((p) => (p.meta.tags || []).includes('completed')).length;

	return {
		completedCount,
		recentPosts: posts.filter((p) => (p.meta.tags || []).includes('software')).slice(0, 6)
	};
}
