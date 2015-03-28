var GLSLCreator = (function(gt) {

   /* Mesh */
   var Mesh = function(gl, vertices, indices, drawMode) {
      var _indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

      var _vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, _vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      var _drawMode = drawMode;
      var _elementCount = indices.length;

      this.delete = function() {
         gl.deleteBuffer(_indexBuffer);
         gl.deleteBuffer(_vertexBuffer);
      }

      this.use = function() {
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _indexBuffer);
         gl.bindBuffer(gl.ARRAY_BUFFER, _vertexBuffer);
      }

      this.draw = function() {
         gl.drawElements(_drawMode, _elementCount, gl.UNSIGNED_SHORT, 0);
      }
   }

   gt.Mesh = Mesh;
   return gt;

})(GLSLCreator || {});
