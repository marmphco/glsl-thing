var Node = require("./gt-node.js");
var Port = require("./gt-port.js");

var ValueNode = function(type) {
   var valuePort = new Port.OutputPort(this, type);

   this._dirty = false;
   this._inputPorts = {};
   this._outputPorts = {
      "value": valuePort
   };

   this.setValue = function(value) {
      valuePort.exportValue(value);
   }

   this.evaluate = function() {}
}
ValueNode.prototype = new Node();

module.exports = ValueNode;