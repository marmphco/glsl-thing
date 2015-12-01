/// <reference path="../typings/jasmine/jasmine.d.ts" />

import Node = require("../lib/Node");
import PortType = require("../lib/PortType");

describe("Node", function() {
    it("should be convertible to JSON", function() {
        var node = new Node();
        expect(herp.toString()).toBe("ShaderProgram");
    });
});