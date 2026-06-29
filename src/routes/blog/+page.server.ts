import { listPosts } from '$lib/notion';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { posts: await listPosts() };
};
