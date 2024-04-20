export type Complex = {
	real: number;
	imag: number;
};

export const add = (a: Complex, b: Complex): Complex => {
	const aReal = a.real;
	const bReal = b.real;

	const aImag = a.imag;
	const bImag = b.imag;

	return {
		real: aReal + bReal,
		imag: aImag + bImag,
	};
};

export const subtract = (a: Complex, b: Complex): Complex => {
	const aReal = a.real;
	const bReal = b.real;

	const aImag = a.imag;
	const bImag = b.imag;

	return {
		real: aReal - bReal,
		imag: aImag - bImag,
	};
};

export const multiply = (a: Complex, b: Complex): Complex => {
	const aReal = a.real;
	const bReal = b.real;

	const aImag = a.imag;
	const bImag = b.imag;

	return {
		real: aReal * bReal - aImag * bImag,
		imag: aReal * bImag + aImag * bReal,
	};
};

export const divide = (a: Complex, b: Complex): Complex => {
	const aReal = a.real;
	const bReal = b.real;

	const aImag = a.imag;
	const bImag = a.imag;

	const denominator = bReal * bReal + bImag * bImag;

	return {
		real: (aReal * bReal + aImag * bImag) / denominator,
		imag: (aImag * bReal - aReal * bImag) / denominator,
	};
};

export const conjugate = (a: Complex): Complex => {
	return {
		real: a.real,
		imag: -a.imag,
	};
};

export const magnitude = (a: Complex): number => {
	const aReal = a.real;
	const aImag = a.imag;

	return Math.sqrt(aReal * aReal + aImag * aImag);
};

export const angle = (a: Complex): number => {
	return Math.atan2(a.imag, a.real);
};
