import { Complex } from "./Complex";
import { getBWColor } from "./color";
import { getFractalRenderer, getOutlineRenderer, clearCanvas } from "./renderers";
import { getCanvasObservables } from "./observables";

export type TVec2 = [number, number];
type TOutlineData = { center: TVec2, scale: number };

const getPixels = ([w, h]: TVec2): TVec2[] =>
    Array.from({ length: w * h }, (_, i) => [i % w, Math.floor(i / h)]);

const getViewOrigin = (dimensions: TVec2, viewCenter: TVec2, scale: number) =>
    viewCenter.map((n, i) => n - (dimensions[i] / 2) / scale) as TVec2;

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

const getRenderer = (
    canvasCleaner: () => void,
    fractalRenderer: () => void,
    outlineRenderer: (center: TVec2, scale: number) => void
) =>
    (outlineData?: TOutlineData) => {
        canvasCleaner();

        fractalRenderer();

        if (outlineData) {
            const { center, scale } = outlineData;
            outlineRenderer(center, scale);
        }
    }

// init
(() => {
    const canvas = document?.getElementById("canvas-1") as HTMLCanvasElement;
    const { width: w, height: h } = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // canvas properties setting
    const dimensions: TVec2 = [w, h];
    const pixels = getPixels(dimensions);

    // fractal properties will be adjustable later
    const viewCenter = [-.8, 0] as TVec2;
    const scale = w / 3; // w / viewWidth
    const iterations = 500;

    // fractal data calculating
    const origin = getViewOrigin(dimensions, viewCenter, scale);
    const viewPoints = getViewPoints(pixels, origin, scale);
    const proximities = getProximities(viewPoints, iterations);

    const fractalColors = proximities.map(getBWColor);

    // render functions setting
    const canvasCleaner = () => clearCanvas(ctx, dimensions);
    const fractalRenderer = getFractalRenderer(ctx, dimensions, fractalColors);
    const outlineRenderer = getOutlineRenderer(ctx, dimensions);

    const render = getRenderer(canvasCleaner, fractalRenderer, outlineRenderer);

    render();

    // subscribe to observable
    const { select$, confirm$ } = getCanvasObservables(canvas);

    select$.subscribe(([scale, center]) => {
        render({ scale, center });
    });

    confirm$.subscribe(([scale, center]) => {
        console.warn({ scale, center });
    })
})();


