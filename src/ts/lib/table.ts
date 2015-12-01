export interface Table<T> {
    [index: string]: T;
}

export function map<T, U>(table: Table<T>, mapper: (value: T, key: string) => U): Table<U> {
    var newTable: Table<U> = {};

    for (var key in table) {
        newTable[key] = mapper(table[key], key);
    }

    return newTable;
}
