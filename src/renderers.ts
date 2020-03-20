import { TRgba } from "./color";
import { TVec2 } from "./index";

export const getFractalRenderer = (ctx: CanvasRenderingContext2D, [w, h]: TVec2, colors: TRgba[]) => {
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

export const getOutlineRenderer = (ctx: CanvasRenderingContext2D, originalSize: TVec2) =>
    (center: TVec2, scale: number = 1) => {
        const [w, h] = originalSize.map(n => n * scale);
        const [x, y] = center;

        ctx.beginPath();
        ctx.rect(x - w / 2, y - h / 2, w, h);
        ctx.closePath();
        ctx.strokeStyle = "blue";
        ctx.stroke();
    }

export const clearCanvas = (ctx: CanvasRenderingContext2D, [w, h]: TVec2) => {
    ctx.clearRect(0, 0, w, h);
}