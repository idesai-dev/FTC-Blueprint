import { getAllPosts } from '$lib/utils/posts';

export const prerender = false;

export async function load() {
	const posts = await getAllPosts();
	return { posts };
}
