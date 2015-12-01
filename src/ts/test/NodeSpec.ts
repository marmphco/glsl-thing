/// <reference path="../typings/jasmine/jasmine.d.ts" />

import Node = require("../lib/Node");
import PortType = require("../lib/PortType");

describe("Node", function() {
    it("should be convertible to JSON", function() {
        const emptyNode = new Node({}, {}, (_: Array<any>) => null );
        
        expect(emptyNode.toJSON()).toEqual({
            "inputPorts": {},
            "outputPorts": {}
        });

        const node = new Node({
            "floatInput": PortType.Float,
        }, {
            "shaderOutput": PortType.Shader,
        }, (_: Array<any>) => null);

        expect(node.toJSON()).toEqual({
            "inputPorts": {
                "floatInput": "Float",
            },
            "outputPorts": {
                "shaderOutput": "Shader",
            }
        });
    });

    it("should evaluate correctly", function() {
        const node = new Node([
            { name: "floatInput", type: PortType.Float }
        ], [
            { name: "shaderOutput", type: PortType.Shader }
        ], (_: Array<any>) => {
            return null;
        });


        expect().toBe();
    });
});