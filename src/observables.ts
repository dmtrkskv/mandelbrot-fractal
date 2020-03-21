import { TVec2 } from "./index";
import { fromEvent, combineLatest } from "rxjs";
import { scan, map, startWith, share, withLatestFrom } from "rxjs/operators";

export const getCanvasObservables = (canvas: HTMLCanvasElement) => {
    const wheelDeltaToScale = (delta: number) => delta < 0 ? -(125 / delta) : delta / 125;

    const mouseDown$ = fromEvent(document, "mousedown");
    const mouseMove$ = fromEvent(document, "mousemove");
    const mouseWheel$ = fromEvent(canvas, "mousewheel");

    const mouseCenter$ = mouseMove$.pipe(map(e => {
        const { clientX, clientY } = e as MouseEvent;
        const {offsetLeft, offsetTop} = canvas;

        return [clientX - offsetLeft, clientY - offsetTop] as TVec2;
    }));

    const initialWheelDelta = -250;

    const wheelScale$ = mouseWheel$.pipe(
        map(e => (e as MouseWheelEvent).deltaY),
        scan((acc, delta) => acc + delta, initialWheelDelta),
        map(wheelDeltaToScale),    
        startWith(wheelDeltaToScale(initialWheelDelta))
    );

    const sharedSelect$ = combineLatest(wheelScale$, mouseCenter$).pipe(share());

    const confirm$ = mouseDown$.pipe(withLatestFrom(sharedSelect$), map(values => values[1]));

    return  { confirm$, select$: sharedSelect$ };
}