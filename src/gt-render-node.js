var port = require("./gt-port.js");
var Node = require("./gt-node.js");
var Mesh = require("./gt-mesh.js");

var uniformSuffix = function(gl, type) {
   switch (type) {
      case gl.FLOAT:      return "1f";
      case gl.FLOAT_VEC2: return "2f";
      case gl.FLOAT_VEC3: return "3f";
      case gl.FLOAT_VEC4: return "4f";
      case gl.FLOAT_MAT2: return "Matrix2fv";
      case gl.FLOAT_MAT3: return "Matrix3fv";
      case gl.FLOAT_MAT4: return "Matrix4fv";
      case gl.INT: return "1i";
      case gl.INT_VEC2: return "2i";
      case gl.INT_VEC3: return "3i";
      case gl.INT_VEC4: return "4i";
      case gl.BOOL: return "1i";
      case gl.BOOL_VEC2: return "2i";
      case gl.BOOL_VEC3: return "3i";
      case gl.BOOL_VEC4: return "4i";
      case gl.SAMPLER_2D: return "1i";
      case gl.SAMPLER_CUBE: return "1i";
   }
}

/* RenderNode */

var RenderNode = function(gl) {
   var meshPort = new port.InputPort(this, port.PortType.Mesh);
   var programPort = new port.InputPort(this, port.PortType.Program);

   this._dirty = false;
   this._inputPorts = {
      "mesh": meshPort,
      "program": programPort
   };
   this._outputPorts = {/* texture */};
   this._uniformPorts = {};

   var generateUniformPorts = function(program, self) {
      // get uniform count
      var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

      var ports = {};
      for (var loc = 0; loc < uniformCount; loc++) {
         var uniform = gl.getActiveUniform(program, loc);

         // merge ports
         if (self._uniformPorts.hasOwnProperty(uniform.name)) {
            ports[uniform.name] = self._uniformPorts[uniform.name];
            ports[uniform.name].setType(uniform.type);
         }
         else {
            ports[uniform.name] = new port.InputPort(self, uniform.type);
         }
      }

      // clean up unused ports
      for (var portName in self._uniformPorts) {
         if (!ports.hasOwnProperty(portName)) {
            self._uniformPorts[portName].unbind();
         }
      }

      return ports;
   }

   this.inputPort = function(name) {
      return this._inputPorts[name] || this._uniformPorts[name];
   }

   this.evaluate = function() {
      var mesh = meshPort.value();
      var program = programPort.value();
      gl.useProgram(program);
      mesh.use();

      // generate input ports for new uniforms
      this._uniformPorts = generateUniformPorts(program, this);

      // set up uniforms
      var textureUnit = 0;
      for (var name in this._uniformPorts) {
         var loc = gl.getUniformLocation(program, name);
         var port = this._uniformPorts[name];
         var functionId = "uniform" + uniformSuffix(gl, port.type());
         var uniformFunc = gl[functionId];

         // wont work for matrices and stuff
         if (port.type() == gl.SAMPLER_2D) {
            uniformFunc.apply(gl, [loc, textureUnit]);

            gl.activeTexture(gl["TEXTURE" + (textureUnit++).toString()]);
            gl.bindTexture(gl.TEXTURE_2D, port.value());
         }
         else {
            uniformFunc.apply(gl, [loc, port.value()]);
         }
      }

      // hardcoded attributes
      var positionLoc = gl.getAttribLocation(program, "iPosition");
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 12, 0);

      // draw to main renderbuffer for now
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      mesh.draw();

      gl.disableVertexAttribArray(positionLoc);
   }
}
RenderNode.prototype = new Node();

module.exports = RenderNode;