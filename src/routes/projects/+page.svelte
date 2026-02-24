<script>
	import projects from '$lib/Projects';
</script>

<svelte:head>
	<title>Daniel Booth — Projects</title>
</svelte:head>

<div class="projectContainer">
	<div class="projects">
		<h1>Projects</h1>
		<p class="note">
			These are some projects I have worked on in my free time; they range from websites to personal tooling I’ve created to empower my workflow.
		</p>
		{#each projects as project (project.title)}
			<div class="project">
				<div class="header">
					<h2>
						{project.title}
					</h2>
					<div class="techsContainer">
						Technologies:
						<div class="techs">
							{#each project.technologies as tech (tech)}
								<span>{tech}</span>
							{/each}
						</div>
					</div>
				</div>
				<p>
					{project.description}
				</p>
				<a href={project.url} target="_blank" rel="noreferrer">
					<div class="button">Project url =></div>
				</a>
			</div>
		{/each}
	</div>
</div>

<style>
	.projectContainer {
		width: 100%;
		max-width: 900px;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	.note {
		opacity: 0.5;
		margin: 0;
		max-width: 900px;
		text-align: left;
	}

	a {
		text-decoration: none;
	}

	.projectContainer .projects {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 40px;
		margin-top: 30px;
	}

	h1 {
		font-weight: 700;
		text-align: start;
	}

	h2 {
		display: flex;
		margin: 0;
	}

	.project {
		text-align: start;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		color: white;
		background: var(--color-surface-900);
		padding: 2rem;
		width: 100%;
		border-radius: 25px;
		transition: transform 0.2s ease-in-out;
	}

	.project p {
		font-weight: 100;
		color: #708090;
	}

	.projects {
		width: 100%;
		margin: 50px auto;
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: 1fr;
		margin-bottom: 10px;
	}

	.techsContainer {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.techs {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.techs span:not(:last-child)::after {
		content: ', ';
	}

	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--color-palette-emerald);
		border: 2px solid var(--color-palette-emerald);
		padding: 10px;
		transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
	}

	.button:hover {
		background-color: var(--color-palette-emerald);
		color: var(--color-palette-dark);
	}

	@media (min-width: 600px) {
		.projectContainer .projects {
			grid-template-columns: repeat(2, 1fr);
		}

		h1, .note {
			grid-column: 1 / -1;
		}
	}

	@media (min-width: 900px) {
		.projectContainer {
			padding: 0;
		}
		.projects > h1 {
			font-size: 48px;
			margin: 50px 0 0 0;
		}

		.projects .project {
			min-height: 200px;
		}
		.button {
			max-width: 200px;
		}
	}
</style>
