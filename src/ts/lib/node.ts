import PortType = require("./PortType");
import table = require("./table");
import Table = table.Table;

interface NodeEvaluator {
    (inputs: Object): Object;
}

type PortMap = Table<PortType>; 

export = class Node {
    _inputPorts: PortMap;
    _outputPorts: PortMap;
    _evaluate: NodeEvaluator;
    
    constructor(inputPorts: PortMap, outputPorts: PortMap, evaluate: NodeEvaluator) {
        this._inputPorts = inputPorts;
        this._outputPorts = outputPorts;
        this._evaluate = evaluate;
    }

    evaluate(inputs: Object): Object {
        return this._evaluate(inputs);
    }

    toJSON(): any {
        return {
            "inputPorts": table.map(this._inputPorts, (type) => {
                return PortType[type];
            }),
            "outputPorts": table.map(this._outputPorts, (type) => {
                return PortType[type];
            }),
        }
    }
}