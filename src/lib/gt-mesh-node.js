var Mesh = require("./gt-mesh.js");
var Node = require("./gt-node.js");
var port = require("./gt-port.js");
var NodeTypes = require('./gt-node-types.js');

var MeshNode = function(gl, drawMode, elementArrayKey, arrays, attributes) {
   var meshPort = new port.OutputPort(this, port.PortType.Mesh);
   meshPort.exportValue(new Mesh(gl, drawMode, elementArrayKey, arrays, attributes));

   this._dirty = false;
   this._inputPorts = {};
   this._outputPorts = {
      "mesh": meshPort,
   };

   this.type = () => NodeTypes.MeshNode;

   this.evaluate = function() {}
}
MeshNode.prototype = new Node();

module.exports = MeshNode;