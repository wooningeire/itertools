function* range(start: number, end: number, step: number=1) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}

function* map<T, R>(iterable: Iterable<T>, fn: (item: T, index: number) => R) {
    let i = 0;
    for (const item of iterable) {
        yield fn(item, i++);
    }
}

function* zip(...iterables: Iterable<unknown>[]) {
    const iterators = iterables.map(it => it[Symbol.iterator]());

    while (true) {
        const values = [];
        for (const iterator of iterators) {
            const {done, value} = iterator.next();
            if (done) return;
            
            values.push(value);
        }
        yield values;
    }
}