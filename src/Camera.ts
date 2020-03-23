import { TVec2 } from "./index";
import { TRgba } from "./colorizers";
import { getProximities } from "./entryChecker";

const pixelToViewPoint = (pixel: TVec2, origin: TVec2, scale: number) =>
    pixel.map((n, i) => origin[i] + n / scale) as TVec2;

export class Camera {
    private readonly iterations = 1000;
    private readonly pixels: TVec2[];
    private proximities!: number[];
    private snapshot!: TRgba[];
    private capturedPoints!: TVec2[];

    constructor(
        private readonly dimensions: TVec2,
        private origin: TVec2,
        private scale: number,
        private colorizer: (p: number) => TRgba
    ) {
        const generatePixels = ([w, h]: TVec2): TVec2[] =>
            Array.from({ length: w * h }, (_, i) => [i % w, Math.floor(i / w)]);
       
        this.pixels = generatePixels(dimensions);
 
        this.capture();
        this.colorize();
    }

    private colorize() {
        console.time("colorize");
        this.snapshot = this.proximities.map(this.colorizer);
        console.timeEnd("colorize");
    }

    private capture() {
        console.time("capture of points");
        this.capturedPoints = this.pixels.map(pixel =>
            pixelToViewPoint(pixel, this.origin, this.scale));
        console.timeEnd("capture of points");

        console.time("proximities");
        this.proximities = getProximities(this.capturedPoints, this.iterations);
        console.timeEnd("proximities");

    }

    public moveByCursor(cursorCenter: TVec2, zoom: number) {    
        this.origin = this.origin.map((n, i) => {
            const outlineDelta = cursorCenter[i] - this.dimensions[i] / 2 / zoom;
            return n + outlineDelta / this.scale;
        }) as TVec2;

        this.scale *= zoom;

        this.capture();
        this.colorize();
    }    

    public getSnapshot() {
        return this.snapshot;
    }
}