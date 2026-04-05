<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
	import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
	import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
	import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { fade, fly } from 'svelte/transition';

	let canvas = $state<HTMLCanvasElement | null>(null);
	let viewerWrap = $state<HTMLDivElement | null>(null);
	let fileInput = $state<HTMLInputElement | null>(null);

	let renderer: THREE.WebGLRenderer;
	let scene = new THREE.Scene();
	let camera: THREE.PerspectiveCamera;
	let controls: OrbitControls;
	let animFrame: number;
	let currentObject = $state<THREE.Object3D | null>(null);
	let currentFile = $state<File | null>(null);

	let showViewer = $state(false);
	let showStats = $state(false);
	let showButtons = $state(false);
	let converting = $state(false);
	let dragging = $state(false);
	let status = $state('');
	let lastDownload = $state('');

	let stats = $state({ verts: 0, tris: 0, size: 0, fmt: '' });

	function initRenderer() {
		if (renderer || !canvas || !viewerWrap) return;

		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(viewerWrap.clientWidth, 400, false);
		renderer.shadowMap.enabled = true;

		camera = new THREE.PerspectiveCamera(50, viewerWrap.clientWidth / 400, 0.1, 1000);
		camera.position.set(3, 2, 3);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const mainLight = new THREE.DirectionalLight(0xffffff, 1);
		mainLight.position.set(5, 10, 7);
		mainLight.castShadow = true;
		scene.add(mainLight);

		const blueLight = new THREE.PointLight(0x7de0ff, 0.5);
		blueLight.position.set(-5, 5, -5);
		scene.add(blueLight);

		const grid = new THREE.GridHelper(10, 20, 0x444444, 0x222222);
		scene.add(grid);

		controls = new OrbitControls(camera, canvas);
		controls.enableDamping = true;
		controls.dampingFactor = 0.1;

		const resizeObserver = new ResizeObserver(() => {
			if (!viewerWrap || !renderer) return;
			const w = viewerWrap.clientWidth;
			renderer.setSize(w, 400, false);
			camera.aspect = w / 400;
			camera.updateProjectionMatrix();
		});
		resizeObserver.observe(viewerWrap);

		function animate() {
			animFrame = requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}
		animate();
	}

	function placeMesh(geometry: THREE.BufferGeometry) {
		if (currentObject) { scene.remove(currentObject); }
		geometry.computeVertexNormals();
		geometry.center();
		
		const material = new THREE.MeshStandardMaterial({ 
			color: 0x7de0ff, 
			roughness: 0.3, 
			metalness: 0.8,
			side: THREE.DoubleSide 
		});
		
		const mesh = new THREE.Mesh(geometry, material);
		const box = new THREE.Box3().setFromObject(mesh);
		const size = new THREE.Vector3();
		box.getSize(size);
		const maxDim = Math.max(size.x, size.y, size.z);
		const scale = 2 / (maxDim || 1);
		mesh.scale.setScalar(scale);
		mesh.castShadow = true;
		
		currentObject = mesh;
		scene.add(mesh);
		camera.position.set(2, 1.5, 2);
		controls.target.set(0, 0, 0);
	}

	function placeGroup(group: THREE.Group) {
		if (currentObject) { scene.remove(currentObject); }
		const box = new THREE.Box3().setFromObject(group);
		const size = new THREE.Vector3();
		box.getSize(size);
		const maxDim = Math.max(size.x, size.y, size.z);
		const scale = 2 / (maxDim || 1);
		group.scale.setScalar(scale);
		const center = new THREE.Vector3();
		box.getCenter(center);
		group.position.sub(center.multiplyScalar(scale));
		
		group.traverse((child: THREE.Object3D) => {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
				if (!child.material) {
					child.material = new THREE.MeshStandardMaterial({ color: 0x7de0ff, roughness: 0.3, metalness: 0.8 });
				}
			}
		});

		currentObject = group;
		scene.add(group);
		camera.position.set(2, 1.5, 2);
		controls.target.set(0, 0, 0);
	}

	async function handleFile(file: File) {
		if (!file) return;
		const ext = file.name.split('.').pop()?.toLowerCase();
		if (!['stl', 'obj', 'ply'].includes(ext || '')) {
			status = 'Unsupported format. Use STL, OBJ, or PLY.';
			return;
		}
		currentFile = file;
		showViewer = true;
		showStats = false;
		showButtons = false;
		status = 'Loading model...';
		lastDownload = '';

		// Use a reactive effect or timeout to wait for canvas mount
		setTimeout(() => {
			initRenderer();
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const buf = e.target?.result as ArrayBuffer;
					if (ext === 'stl') {
						const geo = new STLLoader().parse(buf);
						placeMesh(geo);
						const v = geo.attributes.position.count;
						stats = { verts: v, tris: Math.floor(v / 3), size: file.size, fmt: 'STL' };
					} else if (ext === 'ply') {
						const geo = new PLYLoader().parse(buf);
						placeMesh(geo);
						const v = geo.attributes.position.count;
						const t = geo.index ? geo.index.count / 3 : Math.floor(v / 3);
						stats = { verts: v, tris: Math.round(t), size: file.size, fmt: 'PLY' };
					} else if (ext === 'obj') {
						const text = new TextDecoder().decode(buf);
						const group = new OBJLoader().parse(text);
						placeGroup(group as THREE.Group);
						let v = 0, t = 0;
						group.traverse((c: THREE.Object3D) => {
							if (c instanceof THREE.Mesh) {
								const p = c.geometry.attributes.position;
								if (p) { 
									v += p.count; 
									t += c.geometry.index ? c.geometry.index.count / 3 : Math.floor(p.count / 3); 
								}
							}
						});
						stats = { verts: v, tris: Math.round(t), size: file.size, fmt: 'OBJ' };
					}
					showStats = true;
					showButtons = true;
					status = '';
				} catch (err: any) {
					status = 'Error: ' + err.message;
				}
			};
			reader.readAsArrayBuffer(file);
		}, 50);
	}

	function convert() {
		if (!currentObject || !currentFile) return;
		converting = true;
		status = 'Exporting GLB...';
		const exporter = new GLTFExporter();
		exporter.parse(
			currentObject,
			(result: any) => {
				const blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = currentFile!.name.replace(/\.[^/.]+$/, "") + '.glb';
				a.click();
				URL.revokeObjectURL(url);
				lastDownload = `Success! Downloaded ${a.download}`;
				status = '';
				converting = false;
			},
			(err: any) => {
				status = 'Export failed: ' + err;
				converting = false;
			},
			{ binary: true }
		);
	}

	function reset() {
		if (currentObject) { scene.remove(currentObject); currentObject = null; }
		currentFile = null;
		showViewer = false;
		showStats = false;
		showButtons = false;
		status = '';
		lastDownload = '';
		if (fileInput) fileInput.value = '';
	}

	function fmtBytes(b: number) {
		if (b < 1024) return b + ' B';
		if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
		return (b / 1048576).toFixed(2) + ' MB';
	}

	onDestroy(() => {
		if (animFrame) cancelAnimationFrame(animFrame);
		renderer?.dispose();
	});
</script>

<svelte:head>
	<title>Model Converter — Blueprint</title>
	<meta name="description" content="Convert STL, OBJ, and PLY files to optimized GLB models for Blueprint." />
</svelte:head>

<section class="converter-hero">
	<div class="container">
		<div class="animate-fade-up">
			<span class="tag tag--cyan">Developer Tool</span>
		</div>
		<h1 class="animate-fade-up" style="animation-delay: 60ms">Model Converter</h1>
		<p class="hero-desc animate-fade-up" style="animation-delay: 120ms">
			Transform your raw CAD exports (STL, OBJ, PLY) into lightweight GLB models, perfectly optimized for the Blueprint 3D viewer.
		</p>
	</div>
</section>

<div class="container converter-content">
	<div class="card animate-fade-up" style="animation-delay: 180ms">
		{#if !showViewer}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<div 
				class="drop-zone" 
				class:dragging 
				role="button"
				tabindex="0"
				ondragover={(e) => { e.preventDefault(); dragging = true; }}
				ondragleave={() => dragging = false}
				ondrop={(e) => { e.preventDefault(); dragging = false; handleFile(e.dataTransfer!.files[0]); }}
				onclick={() => fileInput?.click()}
			>
				<input bind:this={fileInput} type="file" accept=".stl,.obj,.ply" class="hidden" onchange={(e) => handleFile((e.target as HTMLInputElement).files![0])} />
				<div class="drop-icon">
					<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
					</svg>
				</div>
				<h3>Drop 3D CAD File</h3>
				<p>or click to browse local files</p>
				<div class="formats-badge">STL · OBJ · PLY</div>
			</div>
		{:else}
			<div class="viewer-container" transition:fade>
				<div bind:this={viewerWrap} class="viewer-wrap">
					<canvas bind:this={canvas}></canvas>
				</div>
				
				{#if showStats}
					<div class="stats-grid" transition:fly={{ y: 20 }}>
						<div class="stat-card">
							<span class="label">Vertices</span>
							<span class="value">{stats.verts.toLocaleString()}</span>
						</div>
						<div class="stat-card">
							<span class="label">Faces</span>
							<span class="value">{stats.tris.toLocaleString()}</span>
						</div>
						<div class="stat-card">
							<span class="label">Format</span>
							<span class="value">{stats.fmt}</span>
						</div>
						<div class="stat-card">
							<span class="label">Original Size</span>
							<span class="value">{fmtBytes(stats.size)}</span>
						</div>
					</div>
				{/if}

				<div class="actions-row">
					<button class="btn btn--blue full-width" onclick={convert} disabled={converting}>
						{#if converting}
							<span class="spinner"></span> Converting...
						{:else}
							Convert to Optimized GLB
						{/if}
					</button>
					<button class="btn btn--secondary" onclick={reset}>Choose Another</button>
				</div>
			</div>
		{/if}

		{#if status}
			<div class="status-banner" transition:fade>
				{status}
			</div>
		{/if}

		{#if lastDownload}
			<div class="success-banner" transition:fade>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="20 6 9 17 4 12"/>
				</svg>
				{lastDownload}
			</div>
		{/if}
	</div>

	<div class="info-section animate-fade-up" style="animation-delay: 240ms">
		<h2>Why GLB?</h2>
		<p>
			GLB is the industry standard for 3D web graphics. It bundles geometry, textures, and lighting data into a single, efficient binary file that loads 10x faster than traditional CAD formats.
		</p>
	</div>
</div>

<style>
	.converter-hero {
		padding: 6rem 0 4rem;
		background: var(--gradient-hero);
		border-bottom: 1px solid var(--border-subtle);
		margin-bottom: 3rem;
	}

	.card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 2.5rem;
		box-shadow: 0 8px 32px rgba(0,0,0,0.2);
		margin-bottom: 4rem;
	}

	.drop-zone {
		border: 2px dashed var(--border);
		border-radius: var(--radius-md);
		padding: 5rem 2rem;
		text-align: center;
		cursor: pointer;
		transition: all var(--transition-base);
		background: rgba(255,255,255,0.02);
	}

	.drop-zone:hover, .drop-zone.dragging {
		border-color: var(--accent-cyan);
		background: rgba(116, 215, 237, 0.05);
		transform: translateY(-2px);
	}

	.drop-icon {
		color: var(--accent-cyan);
		margin-bottom: 1.5rem;
		opacity: 0.8;
	}

	.drop-zone h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
	.drop-zone p { color: var(--text-muted); margin-bottom: 1.5rem; }

	.formats-badge {
		display: inline-block;
		padding: 0.4rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.viewer-wrap {
		width: 100%;
		height: 400px;
		background: #0d0d0d;
		border-radius: var(--radius-md);
		border: 1px solid var(--border);
		overflow: hidden;
		margin-bottom: 1.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: var(--bg-secondary);
		padding: 1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-card .label { font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em; }
	.stat-card .value { font-size: 1.1rem; font-family: var(--font-mono); font-weight: 600; color: var(--text-primary); }

	.actions-row {
		display: flex;
		gap: 1rem;
	}

	.full-width { flex: 1; }

	.status-banner {
		margin-top: 1.5rem;
		padding: 1rem;
		background: rgba(255,255,255,0.05);
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		text-align: center;
		color: var(--text-secondary);
	}

	.success-banner {
		margin-top: 1.5rem;
		padding: 1.25rem;
		background: rgba(126, 255, 160, 0.1);
		border: 1px solid var(--accent-green);
		border-radius: var(--radius-md);
		color: var(--accent-green);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		font-weight: 600;
	}

	.info-section {
		max-width: 600px;
	}

	.info-section h2 { font-size: 1.8rem; margin-bottom: 1rem; }
	.info-section p { color: var(--text-secondary); line-height: 1.7; }

	.hidden { display: none; }

	.spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid white;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
		margin-right: 8px;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	@media (max-width: 640px) {
		.actions-row { flex-direction: column; }
	}
</style>