class Itchain<T> {
    constructor(private readonly iterator: Generator<T>) {}

    static of<T>(iterable: Iterable<T>) {
        return new Itchain(iterable[Symbol.iterator]() as Generator<T>);
    }

    private static * generate<T>(generator: Generator<T, unknown, unknown>) {
        let iteratorResult = generator.next();
        while (!iteratorResult.done) {
            yield iteratorResult.value;

            iteratorResult = generator.next();
        }
    }

    static * countGenerator(count: number, step: number=1) {
        let i = count;

        while (true) {
            yield i;
            i += step;
        }
    }

    static * rangeGenerator(start: number, end: number, step: number=1) {
        for (let i = start; i < end; i += step) {
            yield i;
        }
    }

    static * repeatGenerator<T>(value: T, count: number=Infinity) {
        for (let i = 0; i < count; i++) {
            yield value;
        }
    }

    * mapGenerator<K>(fn: (value: T, index: number) => K) {
        let i = 0;
        for (const value of this.iterator) {
            yield fn(value, i);
        }
    }

    * dropGenerator(count: number) {
        const iterator = this[Symbol.iterator]();
        for (let i = 0; i < count; i++) {
            iterator.next();
        }

        yield* iterator;
    }

    * takeGenerator(count: number) {
        const iterator = this[Symbol.iterator]();

        let result = iterator.next();
        let i = 0;
        while (!result.done && i < count) {
            yield result.value;
            result = iterator.next();
            i++;
        }
    }

    static count(start: number) {
        return new Itchain(this.countGenerator(start));
    }

    static range(start: number, end: number, step: number=1) {
        return new Itchain(this.rangeGenerator(start, end, step));
    }

    static to(end: number, step: number=1) {
        return new Itchain(this.rangeGenerator(0, end, step));
    }

    static repeat<T>(value: T, count: number=Infinity) {
        return new Itchain(this.repeatGenerator(value, count));
    }

    map<K>(fn: (value: T, index: number) => K) {
        return new Itchain(this.mapGenerator(fn));
    }

    drop(count: number) {
        return new Itchain(this.dropGenerator(count));
    }

    take(count: number) {
        return new Itchain(this.takeGenerator(count));
    }

    collect() {
        return [...this.iterator];
    }

    * [Symbol.iterator]() {
        yield* this.iterator;
    }
}

const It = Itchain;

{
    const it = It.of([1, 2, 3]);
    const i = it.map(x => x * 2).map(y => y * 2).drop(1);
    console.log(i.collect());
}


{
    It.to(5).map(x => console.log(x));
}