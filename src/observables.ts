import { TVec2 } from "./index";
import { fromEvent, combineLatest } from "rxjs";
import { scan, map, startWith, share, withLatestFrom, tap, distinctUntilChanged } from "rxjs/operators";

const clamp = (n: number, lower: number, upper: number) => {
    return n >= upper ? upper : (n <= lower ? lower : n);
}

export const getCanvasObservables = (canvas: HTMLCanvasElement) => {
    const wheelDeltaUnit = 125;

    const wheelDeltaToZoom = (delta: number) => {
        if (delta === 0) {
            return 1;
        }

        return delta < 0 ?
            (delta - wheelDeltaUnit) / -wheelDeltaUnit :
            wheelDeltaUnit / (delta + wheelDeltaUnit);
    }

    const mouseDown$ = fromEvent(document, "mousedown");
    const mouseMove$ = fromEvent(document, "mousemove");
    const mouseWheel$ = fromEvent(canvas, "mousewheel");

    const mouseCenter$ = mouseMove$.pipe(map(e => {
        const { pageX: x, pageY: y } = e as MouseEvent;
        const { offsetLeft, offsetTop } = canvas;

        return [x - offsetLeft, y - offsetTop] as TVec2;
    }));

    const initialWheelDelta = -2 * wheelDeltaUnit;

    const wheelScale$ = mouseWheel$.pipe(
        tap(e => e.preventDefault()),
        map(e => (e as MouseWheelEvent).deltaY),
        scan((acc, delta) => clamp(acc + delta, -12 * wheelDeltaUnit, 0), initialWheelDelta),
        distinctUntilChanged(),
        map(wheelDeltaToZoom),
        startWith(wheelDeltaToZoom(initialWheelDelta))
    );

    const sharedSelect$ = combineLatest(wheelScale$, mouseCenter$).pipe(share());

    const confirm$ = mouseDown$.pipe(
        withLatestFrom(sharedSelect$),
        map(values => values[1]),
        startWith()
    );

    return { confirm$, select$: sharedSelect$ };
}