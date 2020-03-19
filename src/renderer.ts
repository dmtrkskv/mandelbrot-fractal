import { TRgba } from "./color";

export const render = (colors: TRgba[], ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const imageData = ctx.createImageData(w, h);

    const { data } = imageData;
    colors.flat().forEach((n, i) => data[i] = n);
    
    ctx.putImageData(imageData, 0, 0);
}