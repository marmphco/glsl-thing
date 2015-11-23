var Port = require("./gt-port.js");
var Node = require("./gt-node.js");
var Mesh = require("./gt-mesh.js");
var NodeTypes = require('./gt-node-types.js');

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

module.exports = class RenderNode extends Node {
   constructor(gl, attributePortDescriptors, uniformPortDescriptors) {
      super();

      this._inputPorts['mesh'] = new Port.InputPort(this, Port.PortType.Mesh);
      this._inputPorts['program'] = new Port.InputPort(this, Port.PortType.Program);
      this._outputPorts['renderedImage'] = new Port.OutputPort(this, gl.SAMPLER_2D);

      this._attributePorts = {};
      this._uniformPorts = {};

      attributePortDescriptors.forEach((attributeDescriptor) => {
         this._attributePorts[attributeDescriptor['name']] = new Port.InputPort(this, attributeDescriptor['type']);
      });

      uniformPortDescriptors.forEach((uniformDescriptor) => {
         this._attributePorts[uniformDescriptor['name']] = new Port.InputPort(this, uniformDescriptor['type']);
      });

      this._gl = gl;

      // set up output color buffer texture
      this._outputTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this._outputTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 640, 480, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      // set up output depth buffer
      this._depthBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 640, 480);

      // set up output framebuffer
      this._framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._outputTexture, 0);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthBuffer);

      // unbind everything
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
   }

   type() {
      return NodeTypes.RenderNode;
   }

   inputPortNames() {
      return super.inputPortNames()
         .concat(Object.keys(this._attributePorts))
         .concat(Object.keys(this._uniformPorts));
   }

   inputPort(name) {
      return super.inputPort(name)
         || this._attributePorts[name]
         || this._uniformPorts[name];
   }

   evaluate() {
      const gl = this._gl;

      const mesh = this.inputPort('mesh').value();
      const program = this.inputPort('program').value();

      // only render if program is valid
      if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
         gl.useProgram(program);

         // generate input ports for new uniforms
         this._attributePorts = this._generateAttributePorts(program);
         this._uniformPorts = this._generateUniformPorts(program);

         // set up vertex attributes
         for (let attributeName in this._attributePorts) {
            const port = this._attributePorts[attributeName];
            if (port.hasProvider()) {
               const bindingFunction = port.value();
               const attributeLoc = gl.getAttribLocation(program, attributeName);
               bindingFunction(attributeLoc);
            }
            else {
               console.warn('attribute ', attributeName, ' is not bound');
            }
         }

         // set up uniforms
         let textureUnit = 0;
         for (let uniformName in this._uniformPorts) {
            const loc = gl.getUniformLocation(program, uniformName);
            const port = this._uniformPorts[uniformName];
            const functionId = 'uniform' + uniformSuffix(gl, port.type());
            const uniformFunc = gl[functionId];

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

         gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);

         gl.clearColor(0.0, 0.0, 0.0, 1.0)
         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
         mesh.draw();
         
         gl.bindFramebuffer(gl.FRAMEBUFFER, null);

         // disable vertex attributes
         for (let attributeName in this._attributePorts) {
            const attributeLoc = gl.getAttribLocation(program, attributeName);
            gl.disableVertexAttribArray(attributeLoc);
         }

         this.outputPort('renderedImage').exportValue(this._outputTexture);
      }
   }

   _generateAttributePorts(program) {
      const gl = this._gl;

      const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

      let ports = {}
      for (let loc = 0; loc < attributeCount; loc++) {
         const attribute = gl.getActiveAttrib(program, loc);

         // merge ports
         if (attribute.name in this._attributePorts) {
            ports[attribute.name] = this._attributePorts[attribute.name];
         }
         else {
            ports[attribute.name] = new Port.InputPort(this, Port.PortType.Attribute);
         }
      }

      // cleanup unused ports
      for (let portName in this._attributePorts) {
         if (!(portName in ports)) {
            // this may require a corresponding unbinding at the app level
            this._attributePorts[portName].unbind();
         }
      }

      return ports;
   }

   _generateUniformPorts(program) {
      const gl = this._gl;

       // get uniform count
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

      let ports = {};
      for (let loc = 0; loc < uniformCount; loc++) {
         const uniform = gl.getActiveUniform(program, loc);

         // merge ports
         if (this._uniformPorts.hasOwnProperty(uniform.name)) {
            ports[uniform.name] = this._uniformPorts[uniform.name];
            ports[uniform.name].setType(uniform.type);
         }
         else {
            ports[uniform.name] = new Port.InputPort(this, uniform.type);
         }
      }

      // clean up unused ports
      for (let portName in this._uniformPorts) {
         if (!ports.hasOwnProperty(portName)) {
            this._uniformPorts[portName].unbind();
         }
      }

      return ports;
   }

   toJSON() {
      return {
         'type': this.type(),
         'attributePorts': Object.keys(this._attributePorts).map((portName) => {
            return {
               'name': portName,
               'type': this._attributePorts[portName].type()
            }
         }),
         'uniformPorts': Object.keys(this._uniformPorts).map((portName) => {
            return {
               'name': portName,
               'type': this._uniformPorts[portName].type()
            }
         }),
      }
   }
};
