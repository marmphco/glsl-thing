/// <reference path="../typings/jasmine/jasmine.d.ts" />

import {Table, map, merge} from '../lib/Table';

describe("ShaderNode", function() {

    it("Merges Properly", () => {
        var table1: Table<number> = {
            "a": 4,
            "b": 8,
            "c": 9
        };

        var table2: Table<number> = {
            "a": 19,
            "d": 68,
            "e": 25,
            "f": 14
        };

        var table3: Table<number> = {
            "a": 453,
            "f": 543,
            "g": 123,
            "h": 898
        };

        var merged = merge(table1, table2, table3);

        expect(merged).toEqual({
            "a": 453,
            "b": 8,
            "c": 9,
            "d": 68,
            "e": 25,
            "f": 543,
            "g": 123,
            "h": 898
        })
    })
});
