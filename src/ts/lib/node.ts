import PortType = require("./PortType");
import table = require("./table");
import Table = table.Table;

interface NodeEvaluator {
    (inputs: Array<any>): Array<any>;
}

interface PortMap extends Table<PortType> {}

export = class Node {
    _inputPorts: PortMap;
    _outputPorts: PortMap;
    
    constructor(inputPorts: PortMap, outputPorts: PortMap, evaluate: NodeEvaluator) {
        this._inputPorts = inputPorts;
        this._outputPorts = outputPorts;
    }

    evaluate(inputCache: Array<any>): Array<any> {
// maybe pushthis up one level
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