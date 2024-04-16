import { Application } from 'pixi.js';
import { Component, createSignal, onCleanup, onMount } from 'solid-js';

const SmithChart: Component = () => {
	let pixiAppEl: HTMLDivElement | undefined;
	const [pixiApp, setPixiApp] = createSignal<Application>();

	onMount(async () => {
		const app = new Application();
		setPixiApp(app);
		await app.init({
			resizeTo: pixiAppEl,
			backgroundColor: 0x1099bb,
		});

		// add to dom

		console.debug('pixiAppEl', pixiAppEl);
		if (pixiAppEl) {
			pixiAppEl.appendChild(app.canvas);
		}
	});

	onCleanup(() => {
		pixiApp()?.destroy();
	});

	return <div class="h-dvh" ref={pixiAppEl} />;
};

export default SmithChart;
