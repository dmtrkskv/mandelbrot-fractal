import { Complex } from "./Complex";
import { getBWColor } from "./color";
import { render } from "./renderer";

type TVec2 = [number, number];

const getPixels = (w: number, h: number): TVec2[] =>
    Array.from({ length: w * h }, (_, i) => [i % w, Math.floor(i / h)]);

const getOrigin = (viewCenter: TVec2, canvasSize: TVec2, scale: number) => 
    viewCenter.map((n, i) => n - (canvasSize[i] / 2) / scale) as TVec2;

const proximityOfComplex = (z: Complex, iterations: number) =>
    (function f(zn: Complex, i: number): number {
        const znSqr = zn.square();

        return (znSqr.module() > 2 || i === iterations) ? i / iterations : f(znSqr.add(z), i + 1);
    })(new Complex(0, 0), 0);

const getProximities = (viewPoints: TVec2[], iterations: number) =>
    viewPoints.map(([x, y]) => proximityOfComplex(new Complex(x, y), iterations));

const pixelToViewPoint = (pixel: TVec2, origin: TVec2, scale: number) =>
    pixel.map((n, i) => origin[i] + n / scale) as TVec2;

const getViewPoints = (pixels: TVec2[], origin: TVec2, scale: number) =>
    pixels.map(pixel => pixelToViewPoint(pixel, origin, scale));

(() => {
    const canvas = document?.getElementById("canvas-1") as HTMLCanvasElement;
    const { width, height } = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const iterations = 500;

    const pixels = getPixels(width, height);

    const viewCenter = [-.8, 0] as TVec2;
    const viewWidth = 3;
    const scale = width / viewWidth;

    const origin = getOrigin(viewCenter, [width, height], scale);
    const viewPoints = getViewPoints(pixels, origin, scale);
    const proximities = getProximities(viewPoints, iterations);
    const colors = proximities.map(getBWColor);

    render(colors, ctx, width, height);
})();
