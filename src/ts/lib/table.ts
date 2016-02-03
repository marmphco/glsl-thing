export interface Table<T> {
    [index: string]: T;
}

// This flattens a table into an array, with entries in no particular order
export function mapToArray<T, U>(table: Table<T>, mapper: (value: T, key: string) => U): U[] {
    var array: U[] = [];

    for (var key in table) {
        array.push(mapper(table[key], key));
    }

    return array;
}

export function map<T, U>(table: Table<T>, mapper: (value: T, key: string) => U): Table<U> {
    var newTable: Table<U> = {};

    for (var key in table) {
        newTable[key] = mapper(table[key], key);
    }

    return newTable;
}

export function merge<T>(...tables: Table<T>[]): Table<T> {
    var merged: Table<T> = {};

    tables.forEach((table) => {
        for (const key in table) {
            merged[key] = table[key];
        }
    });

    return merged;
}