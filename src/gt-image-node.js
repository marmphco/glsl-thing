var GLSLCreator = (function(gt) {

   /* ImageNode */

   var ImageNode = function(gl) {
      var texturePort = new gt.OutputPort(this, gl.SAMPLER_2D);

      this._dirty = false;
      this._inputPorts = {};
      this._outputPorts = {
         "texture": texturePort
      };

      var _texture = gl.createTexture(); // needs to be cleaned up
      this.setImageData = function(imageData) {
         gl.bindTexture(gl.TEXTURE_2D, _texture);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.bindTexture(gl.TEXTURE_2D, null);
         texturePort.exportValue(_texture);
      }

      this.evaluate = function() {}
   }
   ImageNode.prototype = new gt.Node();

   gt.ImageNode = ImageNode;
   return gt;

})(GLSLCreator || {});
