var port = require("./gt-port.js")
var Node = require("./gt-node.js")
var NodeTypes = require('./gt-node-types.js');

var ProgramNode = function(gl) {
   var vertexShaderPort = new port.InputPort(this, port.PortType.VertexShader);
   var fragmentShaderPort = new port.InputPort(this, port.PortType.FragmentShader);
   var programPort = new port.OutputPort(this, port.PortType.Program);

   var _program = gl.createProgram();

   this._dirty = false;
   this._inputPorts = {
      "vertexShader": vertexShaderPort,
      "fragmentShader": fragmentShaderPort
   };
   this._outputPorts = {
      "program": programPort
   };

   this.type = () => NodeTypes.ProgramNode;

   this.evaluate = function() {
      // remove attached shaders
      var shaders = gl.getAttachedShaders(_program);
      shaders.forEach(function(shader) {
         gl.detachShader(_program, shader);
      });

      // attach new shaders
      gl.attachShader(_program, vertexShaderPort.value());
      gl.attachShader(_program, fragmentShaderPort.value());

      gl.linkProgram(_program);
      console.log("Program Link Errors: " + gl.getProgramInfoLog(_program));

      programPort.exportValue(_program);
   }
}
ProgramNode.prototype = new Node();

module.exports = ProgramNode;