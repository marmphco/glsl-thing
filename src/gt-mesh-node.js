var Mesh = require("./gt-mesh.js");
var Node = require("./gt-node.js");
var port = require("./gt-port.js");

var MeshNode = function(gl, vertices, indices, drawMode) {
   var meshPort = new port.OutputPort(this, port.PortType.Mesh);
   meshPort.exportValue(new Mesh(gl, vertices, indices, drawMode));

   this._dirty = false;
   this._inputPorts = {};
   this._outputPorts = {
      "mesh": meshPort,
   };

   this.evaluate = function() {}
}
MeshNode.prototype = new Node();

module.exports = MeshNode;