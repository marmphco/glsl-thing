var port = require("./gt-port.js");
var Node = require("./gt-node.js");

var ShaderNode = function(gl, type) {
   var sourcePort = new port.InputPort(this, port.PortType.String);

   var portType = type == gl.VERTEX_SHADER ?
      port.PortType.VertexShader : port.PortType.FragmentShader;
   var shaderPort = new port.OutputPort(this, portType);

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
ShaderNode.prototype = new Node();

module.exports = ShaderNode;
