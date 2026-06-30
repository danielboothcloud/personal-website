import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { marked } from 'marked';
import { env } from '$env/dynamic/private';

// Runtime env so Cloudflare Pages secrets (platform.env) are read at request time.
const notion = new Client({ auth: env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

// v5 dropped databases.query — resolve the database's first data source once and cache it.
let dataSourceId: string | undefined;
async function getDataSourceId(): Promise<string> {
	if (!dataSourceId) {
		const db = (await notion.databases.retrieve({
			database_id: env.NOTION_DATABASE_ID!
		})) as any;
		dataSourceId = db.data_sources[0].id;
	}
	return dataSourceId!;
}

// Notion's response types are unions of partial/full objects; casting to any here
// keeps the mapping readable without the type ceremony.
function toMeta(page: any) {
	const p = page.properties;
	// The title property's name varies (Notion defaults to "Name"); find it by type.
	const titleProp: any = Object.values(p).find((x: any) => x.type === 'title');
	return {
		title: titleProp?.title?.[0]?.plain_text ?? 'Untitled',
		slug: p.Slug?.rich_text?.[0]?.plain_text ?? page.id,
		description: p.Description?.rich_text?.[0]?.plain_text ?? '',
		tags: (p.Tags?.multi_select ?? []).map((t: any) => t.name)
	};
}

export async function listPosts() {
	const data_source_id = await getDataSourceId();
	const res = await notion.dataSources.query({
		data_source_id,
		filter: { property: 'Published', checkbox: { equals: true } },
		sorts: [{ property: 'Date', direction: 'descending' }]
	});
	return res.results.map(toMeta);
}

// A Notion list item written with line breaks (Shift+Enter) becomes one block whose
// text holds multiple paragraphs separated by \n\n. Markdown only keeps those inside
// the item if continuation lines are indented; otherwise the later paragraphs break
// out flush-left. Indent each list item's own continuation lines to keep them in.
function indentListContinuations(blocks: any[]) {
	for (const b of blocks) {
		if (
			(b.type === 'bulleted_list_item' || b.type === 'numbered_list_item') &&
			b.parent?.includes('\n')
		) {
			const [first, ...rest] = b.parent.split('\n');
			b.parent = [first, ...rest.map((l: string) => (l === '' ? '' : '  ' + l))].join('\n');
		}
		if (b.children?.length) indentListContinuations(b.children);
	}
}

export async function getPost(slug: string) {
	const data_source_id = await getDataSourceId();
	const res = await notion.dataSources.query({
		data_source_id,
		filter: { property: 'Slug', rich_text: { equals: slug } },
		page_size: 1
	});
	const page = res.results[0] as any;
	if (!page) return null;

	const mdBlocks = await n2m.pageToMarkdown(page.id);
	indentListContinuations(mdBlocks);
	const markdown = n2m.toMarkdownString(mdBlocks).parent ?? '';
	// breaks: honour Notion's Shift+Enter line breaks (single \n) instead of collapsing them.
	// {@html} is safe here — content is trusted Notion, not user input.
	const body_html = await marked(markdown, { breaks: true });

	return { ...toMeta(page), body_html };
}
