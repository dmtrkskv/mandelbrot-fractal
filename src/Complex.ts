export class Complex {
    constructor(public a: number, public b: number) { }

    public add(z: Complex) {
        return new Complex(this.a + z.a, this.b + z.b);
    }

    public square() {
        const { a, b } = this;

        return new Complex(a ** 2 - b ** 2, 2 * a * b);
    }

    public module() {
        return Math.sqrt(this.a ** 2 + this.b ** 2);
    }
}