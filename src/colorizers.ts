export type TRgba = [number, number, number, number];

export const getBWColor = (proximity: number): TRgba => {
    const k = Math.floor((1 - proximity) * 255);

    return [k, k, k, 255];
}