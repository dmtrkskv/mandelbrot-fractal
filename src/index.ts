import { getBWColor } from "./colorizers";
import { Renderer } from "./Renderer";
import { getCanvasObservables } from "./observables";
import { Camera } from "./Camera";

export type TVec2 = [number, number];

const canvas = document?.getElementById("fractal") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (ctx) {
    const { width: w, height: h } = canvas;
    const dimensions: TVec2 = [w, h];
    const camera = new Camera(dimensions, [-2, -1.1], w / 3, getBWColor);
    const renderer = new Renderer(ctx, dimensions);
    renderer.updateFractalData(camera.getSnapshot());

    const { select$, confirm$ } = getCanvasObservables(canvas);

    select$.subscribe(([zoom, cursorCenter]) => {
        renderer.updateOutlineData({ zoom, center: cursorCenter });
    });

    confirm$
        .subscribe(([zoom, cursorCenter]) => {
            camera.moveByCursor(cursorCenter, zoom);
            renderer.updateFractalData(camera.getSnapshot());
        });
}



