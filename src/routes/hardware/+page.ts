import { getAllPosts } from '$lib/utils/posts';

export async function load() {
	const posts = await getAllPosts();
	return { posts: posts.filter(p => (p.meta.tags || []).includes('hardware')) };
}
