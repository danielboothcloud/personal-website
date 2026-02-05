<script>
	import skills from '$lib/Skills';
</script>

<svelte:head>
	<title>Daniel Booth — About</title>
</svelte:head>

<div class="container">
	<main>
		<h1>About</h1>
	<p>
		I'm a Platform Engineer and DevOps Consultant based in the United Kingdom, specialising in cloud
		migration and modernisation. I enjoy implementing agile practices to deliver effective solutions that
		actually work. I've worked with retail, financial, and public organisations,
		designing and implementing migrations that balance cost and flexibility. Technology is just a
		tool, so I'm all about finding the right approach and creating solutions that meet unique business
		needs – whether that's across public cloud, on-prem, or bare-metal systems.
	</p>
		<h2>Skills</h2>
		{#each Object.entries(skills) as [section, technologies]}
			<ul>
				<li>
					<h4>
						{section}:
					</h4>
					<div class="list">
						{#each technologies as technology}
							<div>
								{technology}
							</div>
						{/each}
					</div>
				</li>
			</ul>
		{/each}
	</main>
</div>

<style>
	.container {
		max-width: 900px;
		padding: 0;
		display: flex;
		justify-content: center;
	}

	main {
		max-width: 100%;
		min-height: 500px;
		text-align: left;
		margin: 0 auto;
		box-sizing: border-box;
	}

	h1 {
		font-weight: 700;
		margin: 0 0 50px 0;
		font-size: 36px;
		text-align: start;
	}

	h2 {
		margin-top: 50px;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	@media (min-width: 900px) {
		.list {
			flex-direction: row;
		}
		main > h1 {
			font-size: 48px;
		}
	}
</style>
