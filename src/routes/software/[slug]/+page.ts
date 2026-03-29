import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const post = await import(`../../../posts/${params.slug}.md`);
        if (!post.metadata || !post.metadata.title) {
            throw error(404, `Post "${params.slug}" not found`);
        }
        return {
            content: post.default,
            meta: post.metadata
        };
    } catch {
        throw error(404, `Post "${params.slug}" not found`);
    }
}