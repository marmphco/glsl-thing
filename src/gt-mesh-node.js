var GLSLCreator = (function(gt) {

   /* MeshNode */

   var MeshNode = function(gl, vertices, indices, drawMode) {
      var meshPort = new gt.OutputPort(this, gt.PortType.Mesh);
      meshPort.exportValue(new gt.Mesh(gl, vertices, indices, drawMode));

      this._dirty = false;
      this._inputPorts = {};
      this._outputPorts = {
         "mesh": meshPort,
      };

      this.evaluate = function() {}
   }
   MeshNode.prototype = new gt.Node();

   gt.MeshNode = MeshNode;
   return gt;

})(GLSLCreator || {});
