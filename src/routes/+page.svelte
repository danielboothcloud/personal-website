<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import projects from '$lib/Projects';
	import skills from '$lib/Skills';
	import { GithubProfile, LinkedinProfile } from '$lib/Constants';

	const CV = 'https://resume.danielbooth.cloud/daniel-booth-cv.pdf';

	// CRT phosphor themes (cycled via the "View" menu)
	const themes: Record<string, Record<string, string>> = {
		mono: {
			'--bg': '#dcd9c4', '--win': '#efedde', '--ink': '#17160f', '--dim': '#6c6a5b',
			'--line': '#17160f', '--bar': '#17160f', '--baronk': '#efedde',
			'--dot': 'rgba(20,19,15,.16)', '--glow': 'none'
		},
		green: {
			'--bg': '#07140a', '--win': '#0d1f0f', '--ink': '#76f39a', '--dim': '#2f7048',
			'--line': '#235e34', '--bar': '#76f39a', '--baronk': '#07140a',
			'--dot': 'rgba(118,243,154,.14)', '--glow': '0 0 6px rgba(118,243,154,.55)'
		},
		amber: {
			'--bg': '#160f04', '--win': '#1d1407', '--ink': '#ffb84d', '--dim': '#7c561f',
			'--line': '#5e4317', '--bar': '#ffb84d', '--baronk': '#160f04',
			'--dot': 'rgba(255,184,77,.14)', '--glow': '0 0 6px rgba(255,184,77,.5)'
		}
	};
	const phosphors = ['mono', 'green', 'amber'];
	let phosphor = 'mono';
	$: screenStyle = Object.entries(themes[phosphor])
		.map(([k, v]) => `${k}:${v}`)
		.join(';');
	const cyclePhosphor = () =>
		(phosphor = phosphors[(phosphors.indexOf(phosphor) + 1) % phosphors.length]);

	let booted = false;
	let now = '';
	let topZ = 6;

	type WinKey = 'readme' | 'skills' | 'projects' | 'resume' | 'connect' | 'secret';
	let win: Record<WinKey, { open: boolean; x: number; y: number; z: number }> = {
		readme: { open: true, x: 56, y: 56, z: 6 },
		skills: { open: true, x: 470, y: 110, z: 4 },
		projects: { open: false, x: 120, y: 130, z: 3 },
		resume: { open: false, x: 330, y: 110, z: 2 },
		connect: { open: false, x: 540, y: 250, z: 1 },
		secret: { open: false, x: 280, y: 200, z: 1 }
	};

	// --- menubar easter eggs ---
	let glitch = false;
	let godmode = false;
	const flashGlitch = () => {
		glitch = true;
		setTimeout(() => (glitch = false), 450);
	};
	// File → open every app window, scattered so they don't clump on top of each other
	const openAll = () => {
		const scr = document.querySelector('.screen');
		const W = scr ? scr.getBoundingClientRect().width : 1100;
		const H = scr ? scr.getBoundingClientRect().height : 700;
		// relative anchors (fractions of the screen) spread across the desktop
		const layout: Record<string, [number, number]> = {
			readme: [0.02, 0.1],
			skills: [0.58, 0.08],
			projects: [0.04, 0.5],
			resume: [0.36, 0.34],
			connect: [0.62, 0.55]
		};
		(Object.keys(layout) as WinKey[]).forEach((k) => {
			const x = Math.max(2, Math.min(layout[k][0] * W, W - 150));
			const y = Math.max(34, Math.min(layout[k][1] * H, H - 70));
			win[k].open = true;
			win[k].x = x;
			win[k].y = y;
			win[k].z = ++topZ;
		});
		win = win;
	};
	// Special → reveal the secret disk + a quick CRT glitch
	const special = () => {
		open('secret');
		flashGlitch();
	};

	// Konami code → GOD MODE: green phosphor + a glitch
	const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
	let kseq: string[] = [];
	const onKey = (e: KeyboardEvent) => {
		kseq = [...kseq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
		if (kseq.join(',') === KONAMI.join(',')) {
			godmode = true;
			phosphor = 'green';
			flashGlitch();
		}
	};

	const clock = () => {
		const d = new Date();
		const p = (n: number) => String(n).padStart(2, '0');
		return `${p(d.getHours())}:${p(d.getMinutes())}`;
	};

	const start = () => {
		booted = true;
		sessionStorage.setItem('booted', '1');
		window.removeEventListener('keydown', boot);
	};
	const boot = () => {
		if (!booted) start();
	};

	const focus = (k: WinKey) => {
		win[k].z = ++topZ;
		win = win;
	};
	// keep a window's position inside the visible screen (so it can't open/strand off-screen)
	const clampInto = (k: WinKey) => {
		const scr = document.querySelector('.screen');
		if (!scr) return;
		const r = scr.getBoundingClientRect();
		win[k].x = Math.max(2, Math.min(win[k].x, r.width - 100));
		win[k].y = Math.max(34, Math.min(win[k].y, r.height - 60));
	};
	const clampAll = () => {
		(Object.keys(win) as WinKey[]).forEach((k) => {
			if (win[k].open) clampInto(k);
		});
		win = win;
	};

	const open = (k: WinKey) => {
		clampInto(k);
		win[k].open = true;
		win[k].z = ++topZ;
		win = win;
	};
	const close = (k: WinKey) => {
		win[k].open = false;
		win = win;
	};

	// dragging
	let drag: { key: WinKey; dx: number; dy: number } | null = null;
	let raf = 0;
	const startDrag = (e: PointerEvent, key: WinKey) => {
		e.preventDefault();
		focus(key);
		drag = { key, dx: e.clientX - win[key].x, dy: e.clientY - win[key].y };
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
	};
	const move = (e: PointerEvent) => {
		if (!drag) return;
		let x = e.clientX - drag.dx;
		let y = e.clientY - drag.dy;
		const scr = document.querySelector('.screen');
		if (scr) {
			const r = scr.getBoundingClientRect();
			x = Math.max(2, Math.min(x, r.width - 100));
			y = Math.max(30, Math.min(y, r.height - 56));
		}
		const key = drag.key;
		if (raf) cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			win[key].x = x;
			win[key].y = y;
			win = win;
		});
	};
	const up = () => {
		drag = null;
		window.removeEventListener('pointermove', move);
		window.removeEventListener('pointerup', up);
	};

	const email = (e: Event) => {
		e.preventDefault();
		window.location.href = 'mailto:' + 'mail' + String.fromCharCode(64) + 'danielbooth.cloud';
	};

	$: openCount = Object.values(win).filter((w) => w.open).length;

	let tick: ReturnType<typeof setInterval>;
	onMount(() => {
		// Skip the boot screen if this tab has already booted (e.g. returning from /blog).
		if (sessionStorage.getItem('booted')) booted = true;
		now = clock();
		tick = setInterval(() => (now = clock()), 1000);
		if (!booted) window.addEventListener('keydown', boot);
		window.addEventListener('keydown', onKey);
		window.addEventListener('resize', clampAll);
		clampAll(); // pull the auto-opened windows in to fit the current screen
	});
	onDestroy(() => {
		if (typeof window === 'undefined') return;
		clearInterval(tick);
		window.removeEventListener('keydown', boot);
		window.removeEventListener('keydown', onKey);
		window.removeEventListener('resize', clampAll);
		window.removeEventListener('pointermove', move);
		window.removeEventListener('pointerup', up);
	});
</script>

<svelte:head>
	<title>Daniel Booth — DevOps Engineer</title>
	<meta
		name="description"
		content="Daniel Booth — DevOps engineer specialising in cloud-native systems: Kubernetes, Terraform, CI/CD and automation behind faster, more reliable applications."
	/>
</svelte:head>

<div class="bezel">
	<div class="powerled"></div>
	<div class="screen" class:shake={glitch} style={screenStyle}>
		<!-- BOOT / TITLE SCREEN -->
		{#if !booted}
			<div class="boot">
				<div class="bootlogo">DANIEL<br />BOOTH</div>
				<div class="boottag">DEVOPS · CLOUD · AUTOMATION</div>
				<button class="start" on:click={start}>
					<span class="startwrap"
						><span class="car" style="animation:blink 1s steps(1) infinite;">▸</span> PRESS START</span
					>
				</button>
				<div class="boottrack"><div class="bootfill"></div></div>
				<div class="copy">© 2026 DANIELBOOTH.CLOUD — INSERT DISK</div>
			</div>
		{/if}

		<!-- DESKTOP -->
		{#if booted}
			<div class="desktop">
				<!-- menu bar -->
				<div class="menubar">
					<span class="mbrand">BOOTH-OS</span>
					<span class="mitem" role="button" tabindex="0" style="cursor:pointer" on:click={openAll} on:keypress={openAll}>File</span>
					<span class="mitem" role="button" tabindex="0" style="cursor:pointer" on:click={cyclePhosphor} on:keypress={cyclePhosphor}>View</span>
					<span class="mitem" role="button" tabindex="0" style="cursor:pointer" on:click={special} on:keypress={special}>Special</span>
					<span class="mclock"><span>▰▰▰</span><span>{now}</span></span>
				</div>

				<!-- desktop icons -->
				<div class="icons">
					<div class="icon" role="button" tabindex="0" on:click={() => open('readme')} on:keypress={() => open('readme')}>
						<div class="ibox fold"></div><div class="ilabel">README</div>
					</div>
					<div class="icon" role="button" tabindex="0" on:click={() => open('skills')} on:keypress={() => open('skills')}>
						<div class="ibox fold"></div><div class="ilabel">SKILLS</div>
					</div>
					<div class="icon" role="button" tabindex="0" on:click={() => open('projects')} on:keypress={() => open('projects')}>
						<div class="ibox fold"></div><div class="ilabel">PROJECTS</div>
					</div>
					<a class="icon" href="/blog">
						<div class="ibox fold"></div><div class="ilabel">BLOG</div>
					</a>
					<div class="icon" role="button" tabindex="0" on:click={() => open('resume')} on:keypress={() => open('resume')}>
						<div class="ibox fold"></div><div class="ilabel">RESUME</div>
					</div>
					<div class="icon" role="button" tabindex="0" on:click={() => open('connect')} on:keypress={() => open('connect')}>
						<div class="ibox fold"></div><div class="ilabel">CONNECT</div>
					</div>
				</div>

				<!-- README -->
				{#if win.readme.open}
					<div class="win" style="left:{win.readme.x}px; top:{win.readme.y}px; z-index:{win.readme.z}; width:min(580px,88vw)" on:pointerdown={() => focus('readme')}>
						<div class="titlebar" on:pointerdown={(e) => startDrag(e, 'readme')}>
							<span class="ttext">README.TXT</span>
							<span class="xbtn" role="button" tabindex="0" on:click={() => close('readme')} on:keypress={() => close('readme')} on:pointerdown|stopPropagation>×</span>
						</div>
						<div class="winbody">
							<p style="margin:0 0 12px;">
								A DevOps engineer specialising in <span class="hl">cloud-native systems</span> that make
								teams more productive — building the pipelines, clusters, and automation behind faster,
								more reliable applications.
							</p>
							<p style="margin:0 0 12px;">
								Platform Engineer &amp; DevOps Consultant based in the UK, specialising in cloud migration
								and modernisation. I've worked across retail, financial &amp; public organisations, designing
								migrations that balance cost and flexibility — public cloud, on-prem, or bare-metal.
								Technology is just a tool; I'm all about the right approach for the business need.
							</p>
							<p style="margin:0;" class="muted">
								Off the clock: trail bike, hikes, and a home lab built for breaking things on purpose.
							</p>
						</div>
					</div>
				{/if}

				<!-- SKILLS -->
				{#if win.skills.open}
					<div class="win" style="left:{win.skills.x}px; top:{win.skills.y}px; z-index:{win.skills.z}" on:pointerdown={() => focus('skills')}>
						<div class="titlebar" on:pointerdown={(e) => startDrag(e, 'skills')}>
							<span class="ttext">SKILLS.SYS</span>
							<span class="xbtn" role="button" tabindex="0" on:click={() => close('skills')} on:keypress={() => close('skills')} on:pointerdown|stopPropagation>×</span>
						</div>
						<div class="winbody">
							{#each Object.entries(skills) as [section, technologies]}
								<div class="cat">
									<span class="cat-h">{section}</span>
									<div class="chipgrid">
										{#each technologies as tech}
											<span class="chip">{tech}</span>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- PROJECTS -->
				{#if win.projects.open}
					<div class="win" style="left:{win.projects.x}px; top:{win.projects.y}px; z-index:{win.projects.z}" on:pointerdown={() => focus('projects')}>
						<div class="titlebar" on:pointerdown={(e) => startDrag(e, 'projects')}>
							<span class="ttext">PROJECTS.DIR</span>
							<span class="xbtn" role="button" tabindex="0" on:click={() => close('projects')} on:keypress={() => close('projects')} on:pointerdown|stopPropagation>×</span>
						</div>
						<div class="winbody">
							<div class="muted" style="margin-bottom:10px;">Side projects &amp; personal tooling</div>
							{#each projects as project (project.title)}
								<div class="item">
									<div class="item-h">
										<span class="item-t">{project.title}</span>
										<span class="muted">{project.technologies.join(' · ')}</span>
									</div>
									<p style="margin:0 0 6px;">{project.description}</p>
									<a class="btn" href={project.url} target="_blank" rel="noreferrer"><span>↗</span> View on GitHub</a>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- RESUME -->
				{#if win.resume.open}
					<div class="win" style="left:{win.resume.x}px; top:{win.resume.y}px; z-index:{win.resume.z}" on:pointerdown={() => focus('resume')}>
						<div class="titlebar" on:pointerdown={(e) => startDrag(e, 'resume')}>
							<span class="ttext">RESUME.PDF</span>
							<span class="xbtn" role="button" tabindex="0" on:click={() => close('resume')} on:keypress={() => close('resume')} on:pointerdown|stopPropagation>×</span>
						</div>
						<div class="winbody">
							<p style="margin:0 0 12px;">Full CV — experience, education &amp; certifications.</p>
							<div style="display:flex; flex-direction:column; gap:9px;">
								<a class="btn" href={CV} target="_blank" rel="noreferrer"><span>▤</span> Open résumé (PDF)</a>
							</div>
						</div>
					</div>
				{/if}

				<!-- CONNECT -->
				{#if win.connect.open}
					<div class="win" style="left:{win.connect.x}px; top:{win.connect.y}px; z-index:{win.connect.z}" on:pointerdown={() => focus('connect')}>
						<div class="titlebar" on:pointerdown={(e) => startDrag(e, 'connect')}>
							<span class="ttext">CONNECT.EXE</span>
							<span class="xbtn" role="button" tabindex="0" on:click={() => close('connect')} on:keypress={() => close('connect')} on:pointerdown|stopPropagation>×</span>
						</div>
						<div class="winbody">
							<p style="margin:0 0 12px;">&gt; Open a channel:</p>
							<div style="display:flex; flex-direction:column; gap:9px;">
								<a class="btn" href="#" on:click={email}><span>✉</span> <span>mail<span>@</span>danielbooth<span>.</span>cloud</span></a>
								<a class="btn" href="tel:+447418600932"><span>☎</span> +44 7418 600932</a>
								<a class="btn" href={GithubProfile} target="_blank" rel="noreferrer"><span>⌥</span> GitHub</a>
								<a class="btn" href={LinkedinProfile} target="_blank" rel="noreferrer"><span>in</span> LinkedIn</a>
							</div>
							<p style="margin:14px 0 0; display:flex; align-items:center; gap:9px;">
								<span style="width:10px;height:10px;border-radius:50%;background:#3fbf6a;display:inline-block;box-shadow:0 0 7px #3fbf6a;"></span>
								AVAILABLE FOR WORK
							</p>
						</div>
					</div>
				{/if}

				<!-- SECRET (Special menu / easter egg) -->
				{#if win.secret.open}
					<div class="win" style="left:{win.secret.x}px; top:{win.secret.y}px; z-index:{win.secret.z}" on:pointerdown={() => focus('secret')}>
						<div class="titlebar" on:pointerdown={(e) => startDrag(e, 'secret')}>
							<span class="ttext">SECRET.BAS</span>
							<span class="xbtn" role="button" tabindex="0" on:click={() => close('secret')} on:keypress={() => close('secret')} on:pointerdown|stopPropagation>×</span>
						</div>
						<div class="winbody">
							<p style="margin:0 0 10px;" class="muted">10 PRINT "HELLO, EXPLORER"<br />20 GOTO 10</p>
							<p style="margin:0 0 10px;">A wild <span class="hl">CONTAINER</span> appears! You try to <code>kubectl delete</code> it — but it respawns. Classic ReplicaSet.</p>
							<p style="margin:0 0 12px;">★ ACHIEVEMENT UNLOCKED: <span class="hl">CURIOUS CURSOR</span></p>
							<p style="margin:0;" class="muted">Hint: the old gamers' dance still works —<br />↑ ↑ ↓ ↓ ← → ← → B A</p>
						</div>
					</div>
				{/if}

				<!-- status bar -->
				<div class="statusbar">
					<span>{openCount} OPEN</span><span class="muted">|</span><span>danielbooth.cloud</span>
					<span class="mclock" style="margin-left:auto;">▮▮▮ {godmode ? '★ GOD MODE' : 'MEM OK'}</span>
				</div>
			</div>
		{/if}

		<!-- CRT overlays -->
		<div class="scan"></div>
		<div class="flickl"></div>
		<div class="glare"></div>
		<div class="vig"></div>
	</div>
</div>
