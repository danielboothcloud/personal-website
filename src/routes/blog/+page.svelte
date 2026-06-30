<script>
	export let data;
	const articles = data.posts;
</script>

<svelte:head>
	<title>Daniel Booth — Blog</title>
</svelte:head>

<div class="bezel">
	<div class="powerled"></div>
	<div class="screen">
		<div class="menubar">
			<span class="mbrand">BOOTH-OS</span>
			<a class="backbtn" href="/">⟵ Back to Desktop</a>
			<span class="mclock">BLOG</span>
		</div>

		<div class="page">
			<div class="win win-doc">
				<div class="titlebar"><span class="ttext">BLOG.DIR</span></div>
				<div class="winbody">
					<div class="muted" style="margin-bottom:12px;">C:\&gt; dir BLOG /w</div>
					{#each articles as article}
						<div class="item">
							<div class="item-h">
								<span class="item-t">{article.title}</span>
								{#if article.tags.length}<span class="muted">{article.tags.join(' · ')}</span>{/if}
							</div>
							{#if article.description}<p style="margin:0 0 7px;">{article.description}</p>{/if}
							<a class="btn" href={`/blog/${article.slug}`}><span>▸</span> Read article</a>
						</div>
					{/each}
					{#if articles.length === 0}
						<p class="muted">No articles yet.</p>
					{/if}
				</div>
			</div>
		</div>

		<div class="scan"></div>
		<div class="glare"></div>
		<div class="vig"></div>
	</div>
</div>
