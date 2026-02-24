<script>
	import FaLinkedin from 'svelte-icons/fa/FaLinkedin.svelte';
	import FaGithub from 'svelte-icons/fa/FaGithub.svelte';
	import FaEnvelope from 'svelte-icons/fa/FaEnvelope.svelte';
	import FaMedium from 'svelte-icons/fa/FaMedium.svelte';
	import { modalOpened } from '$lib/store';
</script>

<svelte:head>
	<title>Daniel Booth - Main page</title>
</svelte:head>
<main>
	<h1>I'm Daniel a DevOps Engineer 💻 based in the UK</h1>
	<div class="icons">
		<div
			role="button"
			tabindex="0"
			on:keypress={() => {
				modalOpened.set(true);
			}}
			on:click={() => {
				modalOpened.set(true);
			}}
		>
			<div class="icon">
				<FaEnvelope />
			</div>
		</div>

		<a
			href="https://github.com/danielbooth-cloud"
			aria-label="GitHub"
			target="_blank"
			rel="noopener noreferrer"
		>
			<div class="icon">
				<FaGithub />
			</div>
		</a>
		<a
			href="https://www.linkedin.com/in/danielbooth-cloud/"
			aria-label="Linkedin"
			target="_blank"
			rel="noopener noreferrer"
		>
			<div class="icon">
				<FaLinkedin />
			</div>
		</a>
	</div>

	<section class="cv-section">
		<h2>Resume</h2>
		<div class="cv-embed">
			<iframe
				src="https://resume.danielbooth.cloud/daniel-booth_20260224_2211.pdf"
				title="Daniel Booth CV"
			></iframe>
		</div>
		<a
			class="cv-download"
			href="https://resume.danielbooth.cloud/daniel-booth_20260224_2211.pdf"
			target="_blank"
			rel="noopener noreferrer"
		>
			Download Resume
		</a>
	</section>
</main>

<style>
	a {
		color: white;
		text-decoration: none;
	}
	main {
		text-align: center;
		padding: 0;
		margin: 0 auto;

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1 {
		font-weight: 700;
	}

	main > h1 {
		margin: 50px 10px 0;
		font-size: 36px;
	}

	.icons {
		display: flex !important;
		justify-content: center !important;
		align-items: center;
		gap: 20px;
		cursor: pointer;
		font-size: 30px;
		display: flex;
		justify-content: space-between;
		max-width: 200px;
		margin: 50px auto 0;
	}

	.icon {
		cursor: pointer;
		transition: color 0.2s ease-in-out;
		width: 40px;
	}
	.icon:hover {
		color: var(--color-palette-pink);
	}

	.cv-section {
		margin-top: 60px;
		width: 100%;
		max-width: 900px;
		padding: 0 20px 40px;
	}

	.cv-section h2 {
		font-size: 24px;
		font-weight: 700;
		margin-bottom: 20px;
	}

	.cv-embed {
		width: 100%;
		aspect-ratio: 8.5 / 11;
		border-radius: 8px;
		overflow: hidden;
	}

	.cv-embed iframe {
		width: 100%;
		height: 100%;
		border: none;
	}

	.cv-download {
		display: inline-block;
		margin-top: 16px;
		padding: 10px 24px;
		background-color: var(--color-palette-pink);
		color: var(--color-palette-dark);
		border-radius: 6px;
		font-weight: 600;
		transition: opacity 0.2s ease-in-out;
	}

	.cv-download:hover {
		opacity: 0.85;
	}

	@media (min-width: 900px) {
		main > h1 {
			font-size: 48px;
		}
	}

	@media (min-width: 600px) {
		main {
			max-width: none;
		}
	}
</style>
