var Node = require("./gt-node.js");
var Port = require("./gt-port.js");
var NodeTypes = require('./gt-node-types.js');

module.exports = class ValueNode extends Node{
   constructor(type) {
      super();
      this._outputPorts['value'] = new Port.OutputPort(this, type);
   }

   type() {
      return NodeTypes.ValueNode;
   }

   setValue(value) {
      this.outputPort('value').exportValue(value);
   }
};
