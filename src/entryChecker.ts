import { Complex } from "./Complex";
import { TVec2 } from "./index";

const proximityOfComplex = (z: Complex, iterations: number) =>
    (function f(zn: Complex, i: number): number {
        const znSqr = zn.square();

        return (znSqr.module() > 2 || i === iterations) ? i / iterations : f(znSqr.add(z), i + 1);
    })(new Complex(0, 0), 0);

export const getProximities = (points: TVec2[], iterations: number) =>
    points.map(([x, y]) => proximityOfComplex(new Complex(x, y), iterations));
