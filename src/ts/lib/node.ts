import PortType = require("./PortType");
import table = require("./table");
import Table = table.Table;

interface Node {
    inputPorts(): Table<PortType>;
    outputPorts(): Table<PortType>;

    evaluate(inputs: Table<any>): Table<any>;
}

export = Node;