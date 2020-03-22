import { Complex } from "./Complex";
import { TVec2 } from "./index";

// const proximityOfComplex = (z: Complex, iterations: number) =>
//     (function f(zn: Complex, i: number): number {
//         const znSqr = zn.square();

//         return (znSqr.module() > 2 || i === iterations) ? i / iterations : f(znSqr.add(z), i + 1);
//     })(new Complex(0, 0), 0);

const proximityOfComplex = (z: Complex, iterations: number) => {
    let i = 0;
    let zn = new Complex(0, 0);
    let znSqr = zn.square();

    while (i !== iterations && znSqr.module() < 2) {
        zn = znSqr.add(z);
        znSqr = zn.square();
        i++;
    }

    return i / iterations;
}

export const getProximities = (points: TVec2[], iterations: number) =>
    points.map(([x, y]) => proximityOfComplex(new Complex(x, y), iterations));
