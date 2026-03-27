export interface PostMeta {
	title: string;
	date: string;
	description: string;
	tags?: string[];
	author?: string;
	cover?: string;
	published?: boolean;
}

export interface Post {
	slug: string;
	meta: PostMeta;
}

/**
 * Loads all markdown posts from src/posts/*.md
 * Returns sorted array (newest first), filtered to published only.
 */
export async function getAllPosts(): Promise<Post[]> {
	const modules = import.meta.glob<{ metadata: PostMeta }>('/src/posts/*.md');

	const posts: Post[] = await Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			// Extract slug from file path: /src/posts/my-post.md → my-post
			const slug = path.replace('/src/posts/', '').replace('.md', '');
			return { slug, meta: metadata };
		})
	);

	return posts
		.filter((p) => p.meta.published !== false)
		.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

/**
 * Returns a tag color class based on position.
 */
const tagColors = ['tag--cyan', 'tag--green', 'tag--yellow'];
export function tagColor(index: number): string {
	return tagColors[index % tagColors.length];
}
