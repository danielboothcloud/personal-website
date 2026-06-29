import { error } from '@sveltejs/kit';
import { getPost } from '$lib/notion';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const article = await getPost(params.slug);
	if (!article) throw error(404, 'Article not found');
	return { article };
};
