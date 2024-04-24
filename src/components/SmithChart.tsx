import { Application, Container, Graphics } from 'pixi.js';
import {
	type Component,
	createSignal,
	onCleanup,
	onMount,
	createEffect,
} from 'solid-js';
import { getImagArc, getRealCircle } from '~/utils/smithMath';

const PLOT_PADDING = 20;

type SmithChartProps = {
	realCircleValues?: number[];
	imagArcValues?: number[];
};

const SmithChart: Component<SmithChartProps> = ({
	realCircleValues = [0, 0.2, 0.5, 1, 2, 5, 10],
	imagArcValues = [-10, -5, -1, -0.5, -0.2, 0, 0.2, 0.5, 1, 2, 5, 10],
}) => {
	let pixiAppEl: HTMLDivElement | undefined;

	// Do these need to be in signals?
	const [pixiApp] = createSignal<Application>(new Application());
	const [plotContainer] = createSignal<Container>(new Container());

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
		getAngle: (angle: number) => number;
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
		getAngle: () => 0,
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

		const getAngle = (angle: number) => {
			const x = Math.cos(angle);
			const y = -Math.sin(angle);

			return Math.atan2(y, x);
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
			getAngle,
		};
	};

	const handleWindowReize = () => {
		pixiApp().resize();
		plotContainer().removeChildren(); // TODO - is there a more efficient route?
		// console.debug('in handleWindowReize', {
		// 	width: pixiApp().canvas.width,
		// 	height: pixiApp().canvas.height,
		// });
		setPlotDimensions(
			computePlotDimensions(pixiApp().canvas.width, pixiApp().canvas.height),
		);
	};

	// where the magic happens of redrawing on plotDimensions change
	createEffect(() => {
		// do we need to clear graphics?

		const { getX, getY, getR, getAngle } = plotDimensions();

		realCircleValues.forEach((realValue) => {
			const { radius, cx, cy } = getRealCircle(realValue);
			const centerX = getX(cx);
			const centerY = getY(cy);
			const circleRadius = getR(radius);
			plotContainer().addChild(
				new Graphics()
					.circle(centerX, centerY, circleRadius)
					.stroke({ color: 0x000000, width: 3 }), // stroke could be stored in a GraphicsContext appled to constructor
			);
		});

		imagArcValues.map((imagValue) => {
			if (imagValue === 0) {
				const line = new Graphics()
					.moveTo(getX(-1), getY(0))
					.lineTo(getX(1), getY(0));
				plotContainer().addChild(line);
			} else {
				const { cx, cy, radius, angle1, angle2 } = getImagArc(
					imagValue,
					0,
					1e6,
				);
				const anticlockWise = imagValue > 0; // trying to be more European

				console.debug('arcs', {
					cx,
					cy,
					radius,
					angle1,
					angle2,
					anticlockWise,
				});

				const imagArc = new Graphics()
					.arc(
						getX(cx),
						getY(cy),
						getR(radius),
						getAngle(angle1),
						getAngle(angle2),
						anticlockWise,
					)
					.stroke({ color: 0x000000, width: 3 });

				plotContainer().addChild(imagArc);
			}
		});
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

		pixiApp().stage.addChild(plotContainer());
	});

	onCleanup(() => {
		pixiApp()?.destroy();
		window.removeEventListener('resize', handleWindowReize);
	});

	return <div class="grow my-4 mx-2" ref={pixiAppEl} />;
};

export default SmithChart;
