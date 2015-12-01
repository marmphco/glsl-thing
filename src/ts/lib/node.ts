import PortType = require("./PortType");

interface NodeEvaluator {
    (inputs: Array<any>): Array<any>;
}

export = class Node {
    _inputPorts: Array<PortType>;
    _outputPorts: Array<PortType>;
    
    constructor(inputPorts: Array<PortType>, outputPorts: Array<PortType>, evaluate: NodeEvaluator) {
        this.derp = 4;
    }
}