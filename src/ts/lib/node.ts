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
