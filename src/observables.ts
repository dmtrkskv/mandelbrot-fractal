import { TVec2 } from "./index";
import { fromEvent, combineLatest } from "rxjs";
import { scan, map, startWith } from "rxjs/operators";

export const getCanvasObservable = (canvas: HTMLCanvasElement) => {
    const wheelDeltaToScale = (delta: number) => delta < 0 ? -(125 / delta) : delta / 125;

    // const mouseDown$ = fromEvent(document, "mousedown");
    const mouseMove$ = fromEvent(document, "mousemove");
    const mouseWheel$ = fromEvent(canvas, "mousewheel");

    const mouseCenter$ = mouseMove$.pipe(map(e => {
        const { clientX, clientY } = e as MouseEvent;
        const {offsetLeft, offsetTop} = canvas;

        return [clientX - offsetLeft, clientY - offsetTop] as TVec2;
    }));

    const initialWheel = -250;

    const wheelScale$ = mouseWheel$.pipe(
        map(e => (e as MouseWheelEvent).deltaY),
        scan((acc, delta) => acc + delta, initialWheel),
        map(wheelDeltaToScale),    
        startWith(wheelDeltaToScale(initialWheel))
    );

    return combineLatest(wheelScale$, mouseCenter$);
}