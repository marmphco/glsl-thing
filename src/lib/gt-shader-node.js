var port = require("./gt-port.js");
var Node = require("./gt-node.js");
var NodeTypes = require('./gt-node-types.js');

module.exports = class ShaderNode extends Node {
   constructor(gl, type) {
      super();

      const shaderType = type == port.PortType.VertexShader ?
         gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;

      this._inputPorts['source'] = new port.InputPort(this, port.PortType.String);
      this._outputPorts['shader'] = new port.OutputPort(this, type);

      this._gl = gl;
      this._shader = gl.createShader(shaderType);
   }

   type() {
      return NodeTypes.ShaderNode;
   }

   evaluate() {
      const gl = this._gl;

      gl.shaderSource(this._shader, this.inputPort('source').value());
      gl.compileShader(this._shader);

      const infoLog = gl.getShaderInfoLog(this._shader);
      if (infoLog.length > 0) {
         console.warn('Shader Compile Errors: ', infoLog);
      }
      else {
         this.outputPort('shader').exportValue(this._shader);
      }
   }

   toJSON() {
      var json = super.toJSON();
      json['shaderType'] = this.outputPort('shader').type();
      return json;
   }
};
