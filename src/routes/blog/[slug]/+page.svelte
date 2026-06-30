<script lang="ts">
	import type { Article, PageData } from './types.js';

	export let data: PageData;
	let article: Article = data.article;
</script>

<svelte:head>
	<title>Daniel Booth — {article?.title || 'Missing article'}</title>
</svelte:head>

<div class="bezel">
	<div class="powerled"></div>
	<div class="screen">
		<div class="menubar">
			<span class="mbrand">BOOTH-OS</span>
			<a class="backbtn" href="/blog">⟵ Back to Blog</a>
			<a class="backbtn" href="/">Desktop</a>
		</div>

		<div class="page">
			<div class="win win-doc">
				<div class="titlebar">
					<span class="ttext">{(article?.title || 'ARTICLE').toUpperCase()}.TXT</span>
				</div>
				<div class="winbody">
					{#if article}
						<h1>{article.title}</h1>
						{@html article.body_html}
					{:else}
						<p class="muted">Article not found.</p>
					{/if}
				</div>
			</div>
		</div>

		<div class="scan"></div>
		<div class="glare"></div>
		<div class="vig"></div>
	</div>
</div>
