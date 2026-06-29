export interface Article {
	title: string;
	slug: string;
	description: string;
	tags: string[];
	body_html: string;
	notionUrl: string;
}

export interface PageData {
	article: Article;
}
