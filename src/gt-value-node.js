var GLSLCreator = (function(gt) {

   /* ValueNode */

   var ValueNode = function(type) {
      var valuePort = new gt.OutputPort(this, type);

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
   ValueNode.prototype = new gt.Node();

   gt.ValueNode = ValueNode;
   return gt;

})(GLSLCreator || {});
