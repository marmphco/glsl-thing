/// <reference path="../typings/jasmine/jasmine.d.ts" />

import Node = require("../lib/Node");
import PortType = require("../lib/PortType");

describe("Node Graph", function() {
    it("should evaluate correctly", function() {
        const nodes = [
            new Node({
                "floatInput": PortType.Float,
            }, {
                "floatOutput": PortType.Float,
            }, (inputs) => {
                return {
                    "floatOutput": inputs["floatInput"] * 2
                }
            }),
            new Node({
                "floatInput": PortType.Float,
            }, {
                "floatOutput": PortType.Float,
            }, (inputs) => {
                return {
                    "floatOutput": inputs["floatInput"] * 2
                }
            })
        ];

        const bindings = [
            {
                "floatOutput": [
                    {
                        node: 1,
                        name: "floatInput"
                    }
                ]
            },
            {
                "floatOutput": []
            }
        ];

        const inputs = [
            {
                "floatInput": 17
            }
        ];

        //const outputs = [];

        var evaluate = (nodes: Array<Node>, bindings, inputs, nodeID: number): Array<any> => {
            var intermediates = nodes[nodeID].evaluate(inputs[nodeID]);
            var obj = [];
            obj[nodeID] = intermediates;

            for (var outputPort in intermediates) {
                console.log("fsfas")

                for (var binding in bindings[nodeID][outputPort]) {

                    const id = binding.node;
                    const name = binding.name;
                    console.log(nodeID, bindings, inputs);
                    console.log(outputPort, binding, id, name);
                    obj[id] = nodes[id].evaluate(inputs[id]);
                }
            }

            return obj;
        };

        var outputs = evaluate(nodes, bindings, inputs, 0);
console.log(outputs)

        expect(outputs[0]["floatOutput"]).toBe(17 * 2);
        expect(outputs[1]["floatOutput"]).toBe(17 * 2 * 2);
    })

    it("can be converted to JSON", function() {
        expect(false).toBe(true);
    })

    it("can be rebuilt from JSON", function() {
        expect(false).toBe(true);
    })
});