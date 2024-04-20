import { Application, Container, Graphics } from 'pixi.js';
import {
	type Component,
	createSignal,
	onCleanup,
	onMount,
	createEffect,
} from 'solid-js';
import { getRealCircle } from '~/utils/smithMath';

const PLOT_PADDING = 20;

type SmithChartProps = {
	realLineValues?: number[];
};

const SmithChart: Component<SmithChartProps> = ({
	realLineValues = [0, 0.2, 0.5, 1, 2, 5, 10],
}) => {
	let pixiAppEl: HTMLDivElement | undefined;

	// Do these need to be in signals?

	const [pixiApp] = createSignal<Application>(new Application());
	const [plotContainer] = createSignal<Container>(new Container());
	const [smithChartGraphics] = createSignal<Graphics>(new Graphics());

	const [plotDimensions, setPlotDimensions] = createSignal<{
		xMin: number;
		xMax: number;
		yMin: number;
		yMax: number;
		cx: number;
		cy: number;
		r: number;
		getX: (x: number) => number;
		getY: (y: number) => number;
		getR: (rUnscaled: number) => number;
	}>({
		xMin: 0,
		xMax: 0,
		yMin: 0,
		yMax: 0,
		cx: 0,
		cy: 0,
		r: 0,
		getX: () => 0,
		getY: () => 0,
		getR: () => 0,
	});

	const computePlotDimensions = (width: number, height: number) => {
		const cx = width / 2;
		const cy = height / 2;

		const maxDim = Math.min(width, height);

		const xMin = cx - maxDim / 2 + PLOT_PADDING;
		const xMax = cx + maxDim / 2 - PLOT_PADDING;
		const yMin = cy + maxDim / 2 - PLOT_PADDING;
		const yMax = cy - maxDim / 2 + PLOT_PADDING;
		const r = maxDim / 2 - PLOT_PADDING;

		// functions to convernt to app/plot coordinates
		const getX = (x: number) => {
			return cx + r * x;
		};

		const getY = (y: number) => {
			return cy - r * y;
		};

		const getR = (rUnscaled: number) => {
			return rUnscaled * r;
		};

		return {
			xMin,
			xMax,
			yMin,
			yMax,
			r,
			cx,
			cy,
			getX,
			getY,
			getR,
		};
	};

	const handleWindowReize = () => {
		setPlotDimensions(
			computePlotDimensions(pixiApp().canvas.width, pixiApp().canvas.height),
		);
	};

	// where the magic happens of redrawing on plotDimensions change
	createEffect(() => {
		// do we need to clear graphics?
		smithChartGraphics().clear();

		realLineValues.forEach((realValue) => {
			const { radius, cx, cy } = getRealCircle(realValue);
			const centerX = plotDimensions().getX(cx);
			const centerY = plotDimensions().getY(cy);
			const circleRadius = plotDimensions().getR(radius);
			smithChartGraphics().circle(centerX, centerY, circleRadius);
		});

		smithChartGraphics().stroke({ color: 0x000000, width: 4 });
	});

	onMount(async () => {
		await pixiApp().init({
			resizeTo: pixiAppEl,
			backgroundColor: 0xeeeeee,
			antialias: true,
		});

		if (pixiAppEl) {
			pixiAppEl.appendChild(pixiApp().canvas);
			window.addEventListener('resize', handleWindowReize);
		}

		setPlotDimensions(
			computePlotDimensions(pixiApp().canvas.width, pixiApp().canvas.height),
		);

		plotContainer().addChild(smithChartGraphics());

		pixiApp().stage.addChild(plotContainer());
	});

	onCleanup(() => {
		pixiApp()?.destroy();
		window.removeEventListener('resize', handleWindowReize);
	});

	return <div class="grow my-4 mx-2" ref={pixiAppEl} />;
};

export default SmithChart;
