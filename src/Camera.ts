import { TVec2 } from "./index";
import { TRgba } from "./colorizers";
import { getProximities } from "./entryChecker";

const pixelToViewPoint = (pixel: TVec2, origin: TVec2, scale: number) =>
    pixel.map((n, i) => origin[i] + n / scale) as TVec2;

export class Camera {
    private readonly iterations = 1000;
    private readonly pixels: TVec2[];
    private proximities?: number[];
    private snapshot?: TRgba[];
    private scale: number;
    private capturedPoints?: TVec2[]
    private capturedPointsOrigin: TVec2;

    constructor(private readonly dimensions: TVec2) {
        const getPixels = ([w, h]: TVec2): TVec2[] =>
            Array.from({ length: w * h }, (_, i) => [i % w, Math.floor(i / h)]);

        this.pixels = getPixels(dimensions);
        this.scale = dimensions[0] / 3;
        this.capturedPointsOrigin = [-2.5, -1.5];
    }

    private capture() {
        this.capturedPoints = this.pixels.map(pixel =>
            pixelToViewPoint(pixel, this.capturedPointsOrigin, this.scale));
    }

    public move(cursorCenter: TVec2, zoom: number) {
        this.capturedPointsOrigin = this.capturedPointsOrigin.map((prevOriginItem, i) => {
            const cursorOriginItem = cursorCenter[i] - this.dimensions[i] / 2 / zoom;
            return prevOriginItem + cursorOriginItem / this.scale;          
        }) as TVec2;

        this.scale *= zoom;

        this.capture();

        if (this.capturedPoints) {
            this.proximities = getProximities(this.capturedPoints, this.iterations);
        }
    }

    public colorize(mapper: (p: number) => TRgba) {
        this.snapshot = this.proximities?.map(mapper);
    }

    public getSnapshot() {
        return this.snapshot;
    }
}