function* range(start, end, step = 1) {
    for (let i = start; i < end; i += 1) {
        yield i;
    }
}
function* map(iterable, fn) {
    let i = 0;
    for (const item of iterable) {
        yield fn(item, i++);
    }
}
function* zip(...iterables) {
    const iterators = iterables.map(it => it[Symbol.iterator]());
    let anyDone = false;
    while (!anyDone) {
        yield iterators.map(iterator => {
            const { done, value } = iterator.next();
            anyDone ||= done;
            return value;
        });
    }
}
