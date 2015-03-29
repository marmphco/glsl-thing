var GLSLThing = (function(gt) {

   /* ShaderNode */

   var ShaderNode = function(gl, type) {
      var sourcePort = new gt.InputPort(this, gt.PortType.String);

      var portType = type == gl.VERTEX_SHADER ?
         gt.PortType.VertexShader : gt.PortType.FragmentShader;
      var shaderPort = new gt.OutputPort(this, portType);

      var _shader = gl.createShader(type);

      this._dirty = false;
      this._inputPorts = {
         "source": sourcePort
      };
      this._outputPorts = {
         "shader": shaderPort
      };


      this.evaluate = function() {

         gl.shaderSource(_shader, sourcePort.value());
         gl.compileShader(_shader);
         console.log("Shader Compile Errors: " + gl.getShaderInfoLog(_shader));
         shaderPort.exportValue(_shader);
      }
   }
   ShaderNode.prototype = new gt.Node();

   gt.ShaderNode = ShaderNode;
   return gt;

})(GLSLThing || {});
