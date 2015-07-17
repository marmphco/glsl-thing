var NodeTypes = require('./gt-node-types.js');

class Node {
   constructor() {
      this._inputPorts = {};
      this._outputPorts = {};
      this._dirty = false;
   }

   type() {
      return NodeTypes.Node;
   }

   inputPortNames() {
      return Object.keys(this._inputPorts);
   }

   outputPortNames() {
      return Object.keys(this._outputPorts);
   }

   inputPort(name) {
      return this._inputPorts[name];
   }

   outputPort(name) {
      return this._outputPorts[name];
   }

   markDirty() {
      this._dirty = true;
   }

   clean() {
      console.log(this + ' is dirty?: ' + this._dirty)
      if (this._dirty) {
         console.log('evaluating: ' + this);
         this.evaluate();
      }
      this._dirty = false;
   }

   evaluate() {
      // empty implementation
   }
}

module.exports = Node;
