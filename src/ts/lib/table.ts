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

export function merge<T>(...tables: Table<T>[]): Table<T> {
    var merged = {};

    tables.forEach((table) => {
        for (const key in table) {
            merged[key] = table[key];
        }
    });

    return merged;
}