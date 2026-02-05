<script lang="ts">
	import Navbar from '$lib/components/NavBar.svelte';
	import Button from '$lib/components/Button.svelte';
	import FaCopy from 'svelte-icons/fa/FaCopy.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	// import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';
	import { onMount } from 'svelte';
	import { customBackground } from '$lib/store';
	import { Email } from '$lib/Constants';
	// import routes from '$lib/NavRoutes';

	let copied = false;
	const cookieEnabled = false;
	$: showCookieModal = false;

	interface CssVariables {
		[name: string]: string;
	}

	const cssVariables = (
		node: HTMLElement,
		variables: CssVariables
	): { update: (variables: CssVariables) => void } => {
		setCssVariables(node, variables);

		return {
			update(variables: CssVariables) {
				setCssVariables(node, variables);
			}
		};
	};

	const setCssVariables = (node: HTMLElement, variables: CssVariables): void => {
		for (const name in variables) {
			node.style.setProperty(`--${name}`, variables[name]);
		}
	};

	const copy = () => {
		navigator.clipboard.writeText(Email);
	};

	onMount(() => {
		const showCookie = localStorage.getItem('showCookieModal');
		if (showCookie !== null) showCookieModal = JSON.parse(showCookie);
		else showCookieModal = true;
	});

	// beforeNavigate(({ to }) => {
	// 	const pathName = to.pathname;
	// 	const route = routes.find((route) => pathName === route.href);
	// 	if (!route.customColor) {
	// 		customBackground.set('#0a0908');
	// 	} else customBackground.set(route.customColor);
	// });
</script>

<svelte:body use:cssVariables={{ background: $customBackground }} />

{#if showCookieModal && cookieEnabled}
	<div class="cookieContainer">
		<p>🍪 This website use <a href="privacy-policy">Cookies.</a></p>
		<div
			role="button"
			tabindex="0"
			on:keypress={() => {
				showCookieModal = false;
				localStorage.setItem('showCookieModal', 'false');
			}}
			on:click={() => {
				showCookieModal = false;
				localStorage.setItem('showCookieModal', 'false');
			}}
		>
			&#10005;
		</div>
	</div>
{/if}

<Modal>
	<div slot="content" class="modalContainer">
		<h1>Email:</h1>
		<div>
			<p>{Email}</p>
			&nbsp;
			<div class="tooltip">
				<Tooltip tooltip={copied ? 'Copied' : 'Copy'}>
					<div
						id="clipboard"
						role="button"
						tabindex="0"
						on:keypress={() => {
							copied = true;
							copy();
							setTimeout(() => {
								copied = false;
							}, 500);
						}}
						on:click={() => {
							copied = true;
							copy();
							setTimeout(() => {
								copied = false;
							}, 500);
						}}
					>
						<div>
							<FaCopy />
						</div>
					</div>
				</Tooltip>
			</div>
		</div>
		<Button>Send Email</Button>
	</div>
</Modal>
<Navbar segment={$page.url.pathname} />

<slot />

 <style>
	:global(:root) {
		--color-palette-dark: #282C35;
		--color-palette-pink: #FF1A75;
		--color-palette-faded-pink: #FF1A7533;
		--color-palette-emerald: #23D8A1;
		--color-palette-faded-emerald: #23D8A133;
		--color-palette-light: #FEFEFD;
		--color-palette-faded-slate: #5C637040;
		--color-palette-faded-purple: #1a162575;
		--color-primary-50: oklch(29.3% 0.02 266.37deg);
		--color-primary-100: oklch(34.42% 0.07 344.49deg);
		--color-primary-200: oklch(41.54% 0.13 355.24deg);
		--color-primary-300: oklch(49.15% 0.18 0.93deg);
		--color-primary-400: oklch(57.01% 0.21 4.31deg);
		--color-primary-500: oklch(64.79% 0.25 6.68deg);
		--color-primary-600: oklch(68.28% 0.22 1.36deg);
		--color-primary-700: oklch(74.04% 0.18 357.72deg);
		--color-primary-800: oklch(81.6% 0.12 354.67deg);
		--color-primary-900: oklch(90.22% 0.06 352.87deg);
		--color-primary-950: oklch(99.67% 0 105.51deg);
		--color-secondary-50: oklch(86.66% 0.05 300.15deg);
		--color-secondary-100: oklch(78.51% 0.09 303.57deg);
		--color-secondary-200: oklch(70.44% 0.13 304.44deg);
		--color-secondary-300: oklch(62.83% 0.17 303.81deg);
		--color-secondary-400: oklch(55.48% 0.2 302.75deg);
		--color-secondary-500: oklch(49.07% 0.23 300.46deg);
		--color-secondary-600: oklch(45.39% 0.21 299.6deg);
		--color-secondary-700: oklch(41.75% 0.19 298.26deg);
		--color-secondary-800: oklch(37.84% 0.17 296.27deg);
		--color-secondary-900: oklch(34.08% 0.15 293.97deg);
		--color-secondary-950: oklch(30.18% 0.13 291.16deg);
		--color-tertiary-50: oklch(90.73% 0.08 328.92deg);
		--color-tertiary-100: oklch(82.91% 0.13 339.68deg);
		--color-tertiary-200: oklch(76% 0.18 345.55deg);
		--color-tertiary-300: oklch(70.27% 0.23 350.68deg);
		--color-tertiary-400: oklch(66.48% 0.25 355.85deg);
		--color-tertiary-500: oklch(64.54% 0.26 2.48deg);
		--color-tertiary-600: oklch(59.37% 0.24 1.7deg);
		--color-tertiary-700: oklch(53.9% 0.22 0.5deg);
		--color-tertiary-800: oklch(48.45% 0.2 359.66deg);
		--color-tertiary-900: oklch(42.69% 0.17 357.71deg);
		--color-tertiary-950: oklch(36.93% 0.15 355.34deg);
		--color-surface-50: oklch(100% 0 none);
		--color-surface-100: oklch(90.67% 0 none);
		--color-surface-200: oklch(81.41% 0 none);
		--color-surface-300: oklch(71.55% 0 none);
		--color-surface-400: oklch(61.67% 0 none);
		--color-surface-500: oklch(51.03% 0 none);
		--color-surface-600: oklch(44.95% 0 none);
		--color-surface-700: oklch(38.67% 0 none);
		--color-surface-800: oklch(32.11% 0 none);
		--color-surface-900: oklch(25.2% 0 none);
		--color-surface-950: oklch(17.76% 0 none);
		--color-success-500: oklch(82.91% 0.13 174.95deg);
		--color-warning-500: oklch(82.46% 0.14 76.71deg);
		--color-error-500: oklch(63.72% 0.22 28.71deg);
	}

	* {
		box-sizing: border-box;
	}

	@font-face {
		font-family: 'Fira Code', monospace;
		font-display: optional;
		src: url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');
	}

	:global(#svelte) {
		width: 100vw;
		height: 100%;
		max-width: 900px;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	:global(html),
	:global(body) {
		transition: background-color 0.2s ease 0s;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: auto;
		font-family: 'Fira Code', monospace;
		background-color: var(--color-palette-dark);
	}

	:global(body) {
		background-color: var(--background);
		background-size: 200% 200%;
		color: var(--color-palette-light);
		margin: 0;
		box-sizing: border-box;
		display: grid;
		line-height: 1.75;
		place-items: center;
		height: 100%;
		overflow-x: hidden;
	}

	:global(h1) {
		border: 0;
		color: var(--color-palette-light);
	}

	:global(::selection) {
		color: var(--color-palette-dark);
		background: var(--color-palette-pink);
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
		border-radius: 1px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: var(--color-palette-emerald);
		border-radius: 3px;
	}

	:global(::-webkit-scrollbar-track) {
		background-color: transparent;
		border-radius: 1px;
	}

	@media (min-width: 900px) {
		:global(body) {
			padding: 0 100px;
		}
	}

	:global(a) {
		text-decoration: none;
	}

	:global(a) {
		text-decoration: none;
	}

	a {
		color: var(--color-palette-emerald);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
		color: var(--color-palette-pink);
	}

	a:visited {
		color: var(--color-palette-pink);
	}

	.modalContainer div {
		display: flex;
		margin-bottom: 20px;
	}

	.modalContainer p {
		margin: 0;
	}

	:global(.tooltip) {
		visibility: hidden;
	}

	.cookieContainer {
		background: white;
		border-radius: 0px;
		text-align: center;
		width: 100%;
		height: 30px;
		color: black;
		padding: 30px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		position: fixed;
		bottom: 0px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
	}
	.cookieContainer > p > a {
		text-decoration: underline;
	}

	.cookieContainer > div {
		cursor: pointer;
	}

	footer {
		font-size: 16px;
		font-weight: 400;
		padding: 30px 0;
		max-width: 900px;
		text-align: center;
		width: 100%;
	}

	footer a {
		text-decoration: none;
		color: var(--color-palette-pink);
	}
	footer .svelte {
		color: var(--color-palette-emerald);
	}

	footer .me {
		color: #ff3e00;
	}

	@media (min-width: 900px) {
		:global(.tooltip) {
			visibility: visible;
		}
	}
	@media (min-width: 600px) {
		.cookieContainer {
			background: white;
			border-radius: 50px;
			text-align: center;
			width: 350px;
			height: 30px;
			color: black;
			padding: 0 10px;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			position: fixed;
			bottom: 50px;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
