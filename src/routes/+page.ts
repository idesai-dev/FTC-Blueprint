import { getAllPosts } from '$lib/utils/posts';

export async function load() {
	const posts = await getAllPosts();
	return {
		recentPosts: posts.slice(0, 3)
	};
}
