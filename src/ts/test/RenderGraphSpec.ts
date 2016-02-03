/// <reference path="../typings/jasmine/jasmine.d.ts" />

import Node = require("../lib/Node");
import RenderGraph from "../lib/RenderGraph";
import PortType = require("../lib/PortType");
import table = require("../lib/table");
import Table = table.Table;

describe("RenderGraph", function() {

    const dummyNode: Node = {
        inputPorts: () => {
            return {
                "floatInput": PortType.Float
            }
        },
        outputPorts: () => {
            return {
                "floatOutput": PortType.Float
            }
        },
        evaluate: (inputs: Table<any>) => { return {} }
    };

    const gerpNode: Node = {
        inputPorts: () => {
            return {
                "floatInput": PortType.Float
            }
        },
        outputPorts: () => {
            return {
                "stringOutput": PortType.String
            }
        },
        evaluate: (inputs: Table<any>) => { return {} }
    };

    var graph: RenderGraph;

    beforeEach(() => {
        graph = new RenderGraph();
    })

    it("can add nodes", () => {
        const nodeID1 = graph.addNode(dummyNode);
        expect(nodeID1).toBeGreaterThan(-1);
        expect(graph.nodes().length).toBe(1);

        const nodeID2 = graph.addNode(dummyNode);
        expect(nodeID2).toBeGreaterThan(-1);
        expect(nodeID2).not.toBe(nodeID1);
        expect(graph.nodes().length).toBe(2);

    });

    it("can remove nodes", () => {
        const id1 = graph.addNode(dummyNode);
        expect(graph.nodes().length).toBe(1);
        expect(graph.nodes()[id1]).toBe(dummyNode);

        const id2 = graph.addNode(gerpNode);
        expect(graph.nodes().length).toBe(2);
        expect(graph.nodes()[id2]).toBe(gerpNode);

        graph.removeNodeWithID(id2);
        expect(graph.nodes().length).toBe(1);
        expect(graph.nodes()[id1]).toBe(dummyNode);
        
        graph.removeNodeWithID(id1);
        expect(graph.nodes().length).toBe(0);
    });

    it("can bind ports", () => {
        const id1 = graph.addNode(dummyNode);
        const id2 = graph.addNode(dummyNode);

        const sender = {
            node: id1,
            port: "floatOutput"
        };

        const receiver = {
            node: id2,
            port: "floatInput"
        };

        graph.bind({
            sender: sender,
            receiver: receiver
        });
        
        const bindings = graph.bindings();
        expect(bindings.length).toBe(1);
        expect(bindings[0].sender).toEqual(sender);
        expect(bindings[0].receiver).toEqual(receiver);
    });

    it("can unbind ports", () => {
        const id1 = graph.addNode(dummyNode);
        const id2 = graph.addNode(dummyNode);

        const sender = {
            node: id1,
            port: "floatOutput"
        };

        const receiver = {
            node: id2,
            port: "floatInput"
        };

        const binding = {
            sender: sender,
            receiver: receiver
        };

        graph.bind(binding);

        const bindings = graph.bindings();
        expect(bindings.length).toBe(1);
        expect(bindings[0].sender).toEqual(sender);
        expect(bindings[0].receiver).toEqual(receiver);

        graph.unbind(binding);
        expect(graph.bindings().length).toBe(0);
    });

    it("removes related bindings when removing a node", () => {
        const id1 = graph.addNode(dummyNode);
        const id2 = graph.addNode(gerpNode);

        graph.bind({
            sender: {
                node: id1,
                port: "floatOutput"
            },
            receiver: {
                node: id2,
                port: "floatInput"
            }
        });
        expect(graph.bindings().length).toBe(1);

        // remove receiving node
        graph.removeNodeWithID(id2);
        expect(graph.bindings().length).toBe(0);

        // re-add and re-bind receiving node
        const id3 = graph.addNode(gerpNode);
        graph.bind({
            sender: {
                node: id1,
                port: "floatOutput"
            },
            receiver: {
                node: id3,
                port: "floatInput"
            }
        });

        // remove sending node
        graph.removeNodeWithID(id1);
        expect(graph.bindings().length).toBe(0);

        // remove receiving node
        graph.removeNodeWithID(id2);
        expect(graph.bindings().length).toBe(0);
    })

    it("does not allow binding of mismatched types", () => {
        fail("not implemented");
    });

    it("should evaluate correctly", () => {
        fail("not implemented");
    });
});
