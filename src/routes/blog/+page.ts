export async function load() {
	const articles = [
		{
			id: 1,
			title: 'Coming Soon',
			description: 'More articles will be added soon. Stay tuned for updates.',
			tags: ['Updates', 'Coming Soon'],
			link: '#'
		}
	];

	return {
		devToArticles: articles
	};
}
