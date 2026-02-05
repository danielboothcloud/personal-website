import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		article: {
			title: 'Coming Soon',
			description: 'This article is not yet available.',
			content: 'Full article content will be added soon.',
			tags: ['Coming Soon'],
			published_at: new Date().toISOString()
		}
	};
}) satisfies PageLoad;
