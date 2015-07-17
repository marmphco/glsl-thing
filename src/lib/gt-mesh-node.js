var Mesh = require("./gt-mesh.js");
var Node = require("./gt-node.js");
var port = require("./gt-port.js");
var NodeTypes = require('./gt-node-types.js');

module.exports = class MeshNode extends Node {
    constructor(gl, drawMode, elementArrayKey, arrays, attributes) {
        super();

        this._outputPorts['mesh'] = new port.OutputPort(this, port.PortType.Mesh);

        const mesh = new Mesh(gl, drawMode, elementArrayKey, arrays, attributes);
        this.outputPort('mesh').exportValue(mesh);
    }

    type() {
        return NodeTypes.MeshNode;
    }
};