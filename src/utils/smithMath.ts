import { subtract, add, divide, type Complex, multiply } from './complex';
/*
 * First we include functions for computing arcs on Smith chart for going between
 * gamma and normalized load impedance
 */
const zLoadNormalizedToGamma = (zLoadNormalized: Complex) => {
	const numerator = subtract(zLoadNormalized, { real: 1, imag: 0 });
	const denominator = add(zLoadNormalized, { real: 1, imag: 0 });
	return divide(numerator, denominator);
};

const gammaToZLoadNormalized = (gamma: Complex) => {
	const numerator = add({ real: 1, imag: 0 }, gamma);
	const denominator = subtract({ real: 1, imag: 0 }, gamma);
	return divide(numerator, denominator);
};

/*
 * Given the reflection coefficient, gamma, and the carracteristic impedance, z0,
 * gammaToZload computers the complex load impedance
 */
const gammaToZLoad = (gamma: Complex, z0: number) => {
	return multiply({ real: z0, imag: z0 }, gammaToZLoadNormalized(gamma));
};

/*
 * Takes in the value of the constant resitance circle and the start and end point
 * of this arc. The start and end point will be a particular value of the normalized
 * load reactance, xLoad
 *
 * Returns the values of the cirlce center and the start and end points of the arc and radius
 * x represents real gamma, y represents imaginary gamma
 * These numbers will feed into the d3.pth.arcTo path generator funtion
 */
// const getRealCircle = (rL: number, xL1: number, xL2: number) => {
// const zL1: Complex = { real: rL, imag: xL1 }; // normzlied impedance of arc start
// // Don't need to compute conjugate because of symmetry
// const zL2: Complex = { real: rL, imag: xL2 };
// const gamma1 = zLoadNormalizedToGamma(zL1);
// const gamma2 = zLoadNormalizedToGamma(zL2);

export const getRealCircle = (rL: number) => {
	const radius = 1 / (1 + rL);
	const cx = rL / (1 + rL);
	const cy = 0;

	// get angles from centers to gamma crossings
	// let angle1 = math.subtract(gamma1, math.complex(cx, cy)).toPolar().phi;
	// let angle2 = math.subtract(gamma2, math.complex(cx, cy)).toPolar().phi;

	// Keep angles positive for simplicity
	// if (angle1 < 0) {
	// 	angle1 = angle1 + 2 * Math.PI;
	// }
	// if (angle2 < 0) {
	// 	angle2 = angle2 + 2 * Math.PI;
	// }

	return {
		radius,
		cx,
		cy,
		// angle1,
		// angle2,
	};
};
