var Node = function() {

   this.inputPortNames = function(name) {
      return Object.keys(this._inputPorts);
   }

   this.outputPortNames = function(name) {
      return Object.keys(this._outputPorts);
   }

   this.inputPort = function(name) {
      return this._inputPorts[name];
   }

   this.outputPort = function(name) {
      return this._outputPorts[name];
   }

   this.markDirty = function() {
      this._dirty = true;
   }

   this.clean = function() {
      console.log("cleaning: " + this + ", dirty?: " + this._dirty)
      if (this._dirty) {
         console.log("evaluating: " + this);
         this.evaluate();
      }
      this._dirty = false;
   }
}

module.exports = Node;
