var GLSLThing = (function(gt) {

   /* Node */

   var Node = function() {
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

   gt.Node = Node;
   return gt;

})(GLSLThing || {});