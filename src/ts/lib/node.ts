import PortType = require("./PortType");
import InputPort = require("./InputPort");
import OutputPort = require("./OutputPort");
import ValueSink = require("./ValueSink");
import table = require("./table");
import Table = table.Table;

type PortMap = Table<PortType>; 

interface JSONSerializable {
    toJSON(): any;
}

interface Node extends ValueSink<any>, JSONSerializable {
    inputPorts(): Table<InputPort<any>>;
    outputPorts(): Table<OutputPort<any>>;
}

export = Node;

// export = class Node {
//     _inputPorts: PortMap;
//     _outputPorts: PortMap;

//     __outputPorts: Table<OutputPort<number>>;

//     _evaluate: NodeEvaluator;
    
//     constructor(inputPorts: PortMap, outputPorts: PortMap, evaluate: NodeEvaluator) {
//         this._inputPorts = inputPorts;
//         this._outputPorts = outputPorts;
//         this._evaluate = evaluate;
//     }

//     evaluate(inputs: Object): Object {
//         return this._evaluate(inputs);
//     }

//     toJSON(): any {
//         return {
//             "inputPorts": table.map(this._inputPorts, (type) => {
//                 return PortType[type];
//             }),
//             "outputPorts": table.map(this._outputPorts, (type) => {
//                 return PortType[type];
//             }),
//         }
//     }
// }