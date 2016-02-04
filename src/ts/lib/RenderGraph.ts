import {assert, assertHasValue} from "./Assert";
import Node = require("./Node");
import table = require("./Table");
import Table = table.Table;

type NodeID = number;

export interface Port {
    node: NodeID;
    port: string;
}

export interface Binding {
    sender: Port;
    receiver: Port;
}

// TODO break this out into it's own class
interface BindingTable {
    // each input port can have exactly one sender
    inputBindings: Table<Port>;
    // each output port can have multiple receivers
    outputBindings: Table<Port[]>;
}

export default class RenderGraph {

    private _nodes: Node[];

    // An Array with one entry per node in _nodes, 
    // one table per node output port, 
    // one table entry per port binding
    private _bindings: BindingTable[];

    private _outputs: Table<any>[];

    private _freeIndices: NodeID[];

    constructor() {
        this._nodes = [];
        this._bindings = [];
        this._outputs = [];
        this._freeIndices = [];
    }

    nodes(): Node[] {
        return this._nodes.filter((maybeNode) => {
            return maybeNode != null;
        });
    }

    bindings(): Binding[] {
        return this._bindings.filter((bindingTable) => {
            return bindingTable != null;

        }).map((bindingTable, nodeID) => {
            return table.mapToArray(bindingTable.inputBindings, (entry, portName) => {
                return {
                    sender: entry,
                    receiver: {
                        node: nodeID,
                        port: portName
                    }
                };
            });
        }).reduce((flattened, current) => {
            return flattened.concat(current);
        }, []);
    }

    outputsForNodeWithID(nodeID: NodeID): Table<any> {
        return this._outputs[nodeID];
    }

    addNode(node: Node): NodeID {
        assertHasValue(node);

        var nodeID: NodeID;

        if (this._freeIndices.length > 0) {
            nodeID = this._freeIndices.pop();
            this._nodes[nodeID] = node;
        }
        else {
            nodeID = this._nodes.length;
            this._nodes.push(node);
        }

        this._bindings[nodeID] = {
            inputBindings: {},
            outputBindings: {}
        };

        this._outputs[nodeID] = {};

        return nodeID;
    }

    removeNodeWithID(nodeID: NodeID) {
        assertHasValue(this._nodes[nodeID]);

        const bindingsForNode = this._bindings[nodeID];
        // release output bindings on nodes sending to this one
        for (var port in bindingsForNode.inputBindings) {
            this.unbind({
                sender: bindingsForNode.inputBindings[port],
                receiver: { node: nodeID, port: port }
            });
        }

        // release input bindings on nodes receiving from this one
        for (var port in bindingsForNode.outputBindings) {
            const receivers = bindingsForNode.outputBindings[port];

            receivers.forEach((receiver) => {
                this.unbind({
                    sender: { node: nodeID, port: port },
                    receiver: receiver
                });
            });
        }

        // release this node's bindings
        this._bindings[nodeID] = null;

        // release this node's outputs
        // TODO needs code to free resources if they're like GL textures or something
        this._outputs[nodeID] = null;

        // release node
        this._nodes[nodeID] = null;

        // add nodeID to the free list
        this._freeIndices.push(nodeID);
    }

    bind(binding: Binding) {
        this._validateBinding(binding);

        // Add to sending node binding table
        const bindingsForSendingNode = this._bindings[binding.sender.node];

        if (!(binding.sender.port in bindingsForSendingNode.outputBindings)) {
            bindingsForSendingNode.outputBindings[binding.sender.port] = [];
        }
        bindingsForSendingNode.outputBindings[binding.sender.port].push(binding.receiver);

        // Add to receiving node binding table
        const bindingsForReceivingNode = this._bindings[binding.receiver.node];

        bindingsForReceivingNode.inputBindings[binding.receiver.port] = binding.sender;
    }

    unbind(binding: Binding) {
        this._validateBinding(binding);

        // Remove from sending node binding table
        const bindingsForSendingNode = this._bindings[binding.sender.node];
        const outputBindings = bindingsForSendingNode.outputBindings[binding.sender.port];

        const filteredBindings = this._filterPort(outputBindings, binding.receiver);

        bindingsForSendingNode.outputBindings[binding.sender.port] = filteredBindings;

        // Remove from receiving node binding table
        const bindingsForReceivingNode = this._bindings[binding.receiver.node];
        delete bindingsForReceivingNode.inputBindings[binding.receiver.port];
    }

    evaluateNodeWithID(nodeID: NodeID) {
        const node = this._nodes[nodeID];
        assertHasValue(node);

        // assemble node inputs
        // TODO break input assembly out into its own function
        var inputs: Table<any> = {};
        for (const port in this._bindings[nodeID].inputBindings) {
            const sender = this._bindings[nodeID].inputBindings[port];
            inputs[port] = this._outputs[sender.node][sender.port];
        }

        // TODO: must collect and destroy old output values first
        // TODO: use outputs to determine which nodes should be evaluated next
        // TODO: put this in evaluateSubgraphAtNodeWithID
        this._outputs[nodeID] = node.evaluate(inputs);
    }

    evaluateSubgraphAtNodeWithID(nodeID: NodeID) {
        assertHasValue(this._nodes[nodeID]);

        // evaluate the starting node
        this.evaluateNodeWithID(nodeID);

        // evaluate the node's receivers
        // TODO should only evaluate nodes that received a new value
        for (const port in this._bindings[nodeID].outputBindings) {
            const receivers = this._bindings[nodeID].outputBindings[port];
            receivers.forEach((receiver) => {
                this.evaluateSubgraphAtNodeWithID(receiver.node);
            });
        }
    }

    private _validateBinding(binding: Binding) {
        const sendingNode = this._nodes[binding.sender.node];
        const receivingNode = this._nodes[binding.receiver.node];

        // Nodes must exist
        assertHasValue(sendingNode);
        assertHasValue(receivingNode);

        const senderOutputPorts = sendingNode.outputPorts();
        const receiverInputPorts = receivingNode.inputPorts();

        // Ports must exist
        assert(binding.sender.port in senderOutputPorts);
        assert(binding.receiver.port in receiverInputPorts);

        // Port types must match
        assert(senderOutputPorts[binding.sender.port] == receiverInputPorts[binding.receiver.port]);

        // Check for cycles

        assert(!this._isAncestor(binding.sender.node, binding.receiver.node));
    }

    private _isAncestor(node: NodeID, ancestor: NodeID): boolean {
        const parents = table.mapToArray(this._bindings[node].inputBindings, (parentNode) => {
            return parentNode.node;
        });
        return table.mapToArray(this._bindings[node].inputBindings, (parentNode) => {
            return parentNode.node == ancestor || this._isAncestor(parentNode.node, ancestor);
        }).reduce((result, item) => {
            return result || item;
        }, false);
    }

    private _filterPort(ports: Port[], portToRemove: Port): Port[] {
        return ports.filter((port) => {
            return port.node != portToRemove.node
                || port.port != portToRemove.port;
        });
    }
}
