import { TRgba } from "./colorizers";
import { TVec2 } from "./index";

type TCursorData = { center: TVec2, zoom: number };

const getFractalRenderer = (ctx: CanvasRenderingContext2D, [w, h]: TVec2, colors: TRgba[]) => {
    const imageData = ctx.createImageData(w, h);

    const { data } = imageData;

    // todo:
    console.time("slow");
    colors.flat().forEach((n, i) => data[i] = n);
    console.timeEnd("slow");

    return () => {
        ctx.putImageData(imageData, 0, 0);
    }
}

const getOutlineRenderer = (ctx: CanvasRenderingContext2D, originalSize: TVec2) =>
    ({center, zoom = 1} : TCursorData) => {
        const [w, h] = originalSize.map(n => n / zoom);
        const [x, y] = center;

        ctx.beginPath();
        ctx.rect(x - w / 2, y - h / 2, w, h);
        ctx.closePath();
        ctx.strokeStyle = "blue";
        ctx.stroke();
    }

const clearCanvas = (ctx: CanvasRenderingContext2D, [w, h]: TVec2) => {
    ctx.clearRect(0, 0, w, h);
}

export class Renderer {
    private fractalRenderer?: () => void;
    private outlineRenderer: (a: TCursorData) => void;
    private cursorData?: TCursorData;

    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly dimensions: TVec2
    ) {
        this.outlineRenderer = getOutlineRenderer(ctx, dimensions);
    }

    private canvasCleaner() {
        clearCanvas(this.ctx, this.dimensions);
    }

    public updateFractalData(colors: TRgba[]) {
        this.fractalRenderer = getFractalRenderer(this.ctx, this.dimensions, colors);
        this.render();
    }

    public updateOutlineData(data: TCursorData) {
        this.cursorData = data;
        this.render();
    }

    public render() { 
        this.canvasCleaner();
        this.fractalRenderer?.();

        if (this.cursorData) {
            this.outlineRenderer(this.cursorData);
        }
    }
}