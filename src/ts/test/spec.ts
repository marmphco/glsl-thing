/// <reference path="../typings/jasmine/jasmine.d.ts" />

import Node = require("../lib/Node");

describe("derp", function() {
    it("should be cool", function() {
        var herp = new Node();
        expect(herp.derp).toBe(0);
    });

    it("should be fsd", function() {
        expect(true).toBe(false);
    });
});