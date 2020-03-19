import { Complex } from "./Complex";
import { getBWColor } from "./color";
import { render } from "./renderer";

type TVec2 = [number, number];

const getPixels = (w: number, h: number): TVec2[] =>
    Array.from({ length: w * h }, (_, i) => [i % w, Math.floor(i / h)]);

const proximityOfComplex = (z: Complex, iterations: number) =>
    (function f(zn: Complex, i: number): number {
        const znSqr = zn.square();

        return (znSqr.module() > 2 || i === iterations) ? i / iterations : f(znSqr.add(z), i + 1);
    })(new Complex(0, 0), 0);

const getProximities = (areaPoints: TVec2[], iterations: number) =>
    areaPoints.map(([x, y]) => proximityOfComplex(new Complex(x, y), iterations));

const pixelToAreaPoint = (pixel: TVec2, origin: TVec2, scale: number) =>
    pixel.map((n, i) => origin[i] + n / scale) as TVec2;

const getAreaPoints = (pixels: TVec2[], origin: TVec2, scale: number) =>
    pixels.map(pixel => pixelToAreaPoint(pixel, origin, scale));

(() => {
    const canvas = document?.getElementById("canvas-1") as HTMLCanvasElement;
    const { width, height } = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const iterations = 500;

    const pixels = getPixels(width, height);

    // const origin = [.35, 0.35] as TVec2;
    // const areaWidth = .001;
    const origin = [-2, -1] as TVec2;
    const areaWidth = 3;
    const scale = width / areaWidth;

    const areaPoints = getAreaPoints(pixels, origin, scale);
    const proximities = getProximities(areaPoints, iterations);
    const colors = proximities.map(getBWColor);

    render(colors, ctx, width, height);
})();
