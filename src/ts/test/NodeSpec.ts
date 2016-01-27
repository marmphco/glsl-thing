/// <reference path="../typings/jasmine/jasmine.d.ts" />

import Node = require("../lib/Node");
import PortType = require("../lib/PortType");

describe("Node", function() {
    it("can be converted to JSON", function() {
        const emptyNode = new Node({}, {}, (_: Array<any>) => null );
        
        expect(emptyNode.toJSON()).toEqual({
            "inputPorts": {},
            "outputPorts": {}
        });

        const node = new Node({
                "floatInput": PortType.Float,
            }, {
                "shaderOutput": PortType.VertexShader,
            }, (_) => null);

        expect(node.toJSON()).toEqual({
            "inputPorts": {
                "floatInput": "Float",
            },
            "outputPorts": {
                "shaderOutput": "VertexShader",
            }
        });
    });

    it("should evaluate correctly", function() {
        const node = new Node({
                "floatInput": PortType.Float,
            }, {
                "floatOutput": PortType.Float,
            }, (inputs) => {
                return {
                    "floatOutput": inputs["floatInput"] * 2
                }
            });

        expect(node.evaluate({
            "floatInput": 4
        })).toEqual({
            "floatOutput": 8
        });

        expect(node.evaluate({
            "floatInput": -3
        })).toEqual({
            "floatOutput": -6
        });
    });
});
