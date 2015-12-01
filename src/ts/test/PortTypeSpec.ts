/// <reference path="../typings/jasmine/jasmine.d.ts" />

import PortType = require("../lib/PortType");

describe("PortType", function() {
    it("should map values to correct string names", function() {
        expect(PortType[PortType.Float]).toEqual("Float");
        expect(PortType[PortType.ShaderProgram]).toEqual("ShaderProgram");
    });
});