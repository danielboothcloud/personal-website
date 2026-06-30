<script lang="ts">
	import '$lib/retro.css';
	import { onMount } from 'svelte';

	onMount(() => {
		const handler = (e: MouseEvent) => {
			const a = (e.target as HTMLElement)?.closest?.('a');
			if (!a || a.target === '_blank') return;
			if (a.host && a.host !== location.host) {
				e.preventDefault();
				window.open(a.href, '_blank', 'noopener');
			}
		};
		document.addEventListener('click', handler);
		return () => document.removeEventListener('click', handler);
	});
</script>

<slot />
