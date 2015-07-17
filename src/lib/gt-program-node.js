var port = require("./gt-port.js")
var Node = require("./gt-node.js")
var NodeTypes = require('./gt-node-types.js');

module.exports = class ProgramNode extends Node {
   constructor(gl) {
      super();

      this._inputPorts['vertexShader'] = new port.InputPort(this, port.PortType.VertexShader);
      this._inputPorts['fragmentShader'] = new port.InputPort(this, port.PortType.FragmentShader);
      this._outputPorts['program'] = new port.OutputPort(this, port.PortType.Program);

      this._gl = gl;
      this._program = gl.createProgram();
   }

   type() {
      return NodeTypes.ProgramNode;
   }

   evaluate() {
      const gl = this._gl;

      // remove attached shaders
      let shaders = gl.getAttachedShaders(this._program);
      shaders.forEach((shader) => {
         gl.detachShader(this._program, shader);
      });

      // attach new shaders
      gl.attachShader(this._program, this.inputPort('vertexShader').value());
      gl.attachShader(this._program, this.inputPort('fragmentShader').value());

      gl.linkProgram(this._program);

      const infoLog = gl.getProgramInfoLog(this._program);
      if (infoLog.length > 0) {
         console.warn('Program Link Errors: ', infoLog);
      }
      else {
         this.outputPort('program').exportValue(this._program);
      }
   }
};