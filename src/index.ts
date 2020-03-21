import { getBWColor } from "./colorizers";
import { Renderer } from "./Renderer";
import { getCanvasObservables } from "./observables";
import { startWith } from "rxjs/operators";
import { Camera } from "./Camera";

export type TVec2 = [number, number];

const canvas = document?.getElementById("canvas-1") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (ctx) {
    const { width: w, height: h } = canvas;
    const dimensions: TVec2 = [w, h];
    const camera = new Camera(dimensions);
    const renderer = new Renderer(ctx, dimensions);

    const { select$, confirm$ } = getCanvasObservables(canvas);

    select$.subscribe(([zoom, cursorCenter]) => {
        renderer.updateOutlineData({ zoom, center: cursorCenter });
    });

    confirm$.pipe(
        startWith([1, [w / 2, h / 2]] as [number, TVec2])
    )
        .subscribe(([zoom, cursorCenter]) => {
            camera.move(cursorCenter, zoom);
            camera.colorize(getBWColor);
            const snapshot = camera.getSnapshot();

            if (snapshot) {
                renderer.updateFractalData(snapshot);
            }
        });
}



