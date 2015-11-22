var Mesh = require("./gt-mesh.js");
var Node = require("./gt-node.js");
var Port = require("./gt-port.js");
var NodeTypes = require('./gt-node-types.js');

module.exports = class MeshNode extends Node {
    constructor(gl, drawMode, elementArrayKey, arrays, attributes) {
        super();

        const mesh = new Mesh(gl, drawMode, elementArrayKey, arrays, attributes);

        this._outputPorts['mesh'] = new Port.OutputPort(this, Port.PortType.Mesh);
        this.outputPort('mesh').exportValue(mesh);

        for (let attributeName in attributes) {
            const port = new Port.OutputPort(this, Port.PortType.Attribute);
            port.exportValue(mesh.attributeBindingFunction(attributeName));
            this._outputPorts['attr:' + attributeName] = port;
        }
    }

    type() {
        return NodeTypes.MeshNode;
    }

    toJSON() {
        var json = super.toJSON();
        json['mesh'] = this.outputPort('mesh').value().toJSON();
        return json;
    }
};