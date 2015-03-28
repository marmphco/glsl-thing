var GLSLCreator = (function(exports) {

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

   /*
      Renders @texture to the draw buffer, then uses
      toDataURL() to extract the dataURL.

      Really slow, creates and destroys buffers and
      shaders during each execution.
   */
   var dataURLWithTexture = function(gl, texture) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      var quad = new Mesh(gl, new Float32Array([
         -1.0, -1.0,
          1.0, -1.0,
         -1.0,  1.0,
          1.0,  1.0
      ]), new Int16Array([0, 1, 2, 3]), gl.TRIANGLE_STRIP);

      var vShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vShader, "\
         attribute lowp vec2 iPos;\
         varying lowp vec2 vTexCoord;\
         void main(void) {\
            gl_Position = vec4(iPos, 0.0, 1.0);\
            vTexCoord = (iPos + vec2(1.0)) * 0.5;\
         }");
      gl.compileShader(vShader);

      var fShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fShader, "\
         varying lowp vec2 vTexCoord;\
         uniform sampler2D tex;\
         void main(void) {\
            gl_FragColor = texture2D(tex, vTexCoord);\
         }");
      gl.compileShader(fShader);

      var program = gl.createProgram();
      gl.attachShader(program, vShader);
      gl.attachShader(program, fShader);
      gl.linkProgram(program);

      gl.useProgram(program);
      quad.use();

      var positionLoc = gl.getAttribLocation(program, "iPos");
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 8, 0);

      var textureLoc = gl.getUniformLocation(program, "uTex");
      gl.uniform1i(textureLoc, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      quad.draw();

      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteProgram(program);
      quad.delete();

      gl.disableVertexAttribArray(positionLoc);

      return gl.canvas.toDataURL();
   }

   var Context = function(element) {
      var gl = this.gl = element.getContext("webgl", {
         preserveDrawingBuffer: true
      });
   }

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

   /* PortTypes that have no OpenGL analog */
   var PortType = {
      "String": "StringPortType",
      "FragmentShader": "FragmentShaderPortType",
      "VertexShader": "VertexShaderPortType",
      "ShaderProgram": "ProgramPortType",
      "Mesh": "MeshPortType"
   };

   /* InputPort */

   var InputPort = function(node, type) {
      var _node = node;
      var _type = type;
      var _provider = null;
      var self = this;

      this.type = function() {
         return _type;
      }

      this.setType = function(type) {
         _type = type;
      }

      this.hasProvider = function() {
         return _provider != null;
      }

      // not necessary?
      this.provider = function() {
         return _provider;
      }

      this.bindTo = function(outputPort) {
         if (_type === outputPort.type()) {
            if (self.hasProvider()) {
               _provider.removeReceiver(self);
            }
            _provider = outputPort;
            _provider.addReceiver(self);
            self.markDirty();
         }
         else {
            console.log(
               "Incompatible port types in binding: "
               + outputPort.type()
               + " => "
               + _type)
         }
      };

      this.unbind = function() {
         if (self.hasProvider()) {
            _provider.removeReceiver(self);
            _provider = null;
         }
      }

      this.value = function() {
         if (self.hasProvider()) {
            return _provider.value();
         } else {
            return undefined;
         }
      }

      this.markDirty = function() {
         _node.markDirty();
         setTimeout(function() {
            _node.clean()
         }, 0);
      }
   }

   /* OutputPort */

   var OutputPort = function(node, type) {
      var _node = node;
      var _type = type;
      var _value;
      var _receivers = [];

      this.type = function() {
         return _type;
      }

      this.addReceiver = function(receiver) {
         _receivers.push(receiver);
      }

      this.removeReceiver = function(receiver) {
         // yeah this is no good
         _receivers.splice(_receivers.indexOf(receiver), 1);
      }

      this.value = function() {
         return _value;
      }

      this.exportValue = function(value) {
         console.log("exporting value: " + value);
         _value = value;
         _receivers.forEach(function(receiver) {
            receiver.markDirty();
         });
      }
   }

   /* Node */

   var Node = function() {
      this.inputPort = function(name) {
         return this._inputPorts[name];
      }

      this.outputPort = function(name) {
         return this._outputPorts[name];
      }

      this.markDirty = function() {
         this._dirty = true;
      }

      this.clean = function() {
         console.log("cleaning: " + this + ", dirty?: " + this._dirty)
         if (this._dirty) {
            console.log("evaluating: " + this);
            this.evaluate();
         }
         this._dirty = false;
      }
   }

   /* ValueNode */

   var ValueNode = function(type) {
      var valuePort = new OutputPort(this, type);

      this._dirty = false;
      this._inputPorts = {};
      this._outputPorts = {
         "value": valuePort
      };

      this.setValue = function(value) {
         valuePort.exportValue(value);
      }

      this.evaluate = function() {}
   }
   ValueNode.prototype = new Node();

   /* ImageNode */

   var ImageNode = function(gl) {
      var texturePort = new OutputPort(this, gl.SAMPLER_2D);

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
   ImageNode.prototype = new Node();

   /* MeshNode */

   var MeshNode = function(gl, vertices, indices, drawMode) {
      var meshPort = new OutputPort(this, PortType.Mesh);
      meshPort.exportValue(new Mesh(gl, vertices, indices, drawMode));

      this._dirty = false;
      this._inputPorts = {};
      this._outputPorts = {
         "mesh": meshPort,
      };

      this.evaluate = function() {}
   }
   MeshNode.prototype = new Node();

   /* ShaderNode */

   var ShaderNode = function(gl, type) {
      var sourcePort = new InputPort(this, PortType.String);

      var portType = type == gl.VERTEX_SHADER ?
         PortType.VertexShader : PortType.FragmentShader;
      var shaderPort = new OutputPort(this, portType);

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

   /* ProgramNode */

   var ProgramNode = function(gl) {
      var vertexShaderPort = new InputPort(this, PortType.VertexShader);
      var fragmentShaderPort = new InputPort(this, PortType.FragmentShader);
      var programPort = new OutputPort(this, PortType.Program);

      var _program = gl.createProgram();

      this._dirty = false;
      this._inputPorts = {
         "vertexShader": vertexShaderPort,
         "fragmentShader": fragmentShaderPort
      };
      this._outputPorts = {
         "program": programPort
      };

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

   /* RenderNode */

   var RenderNode = function(gl) {
      var meshPort = new InputPort(this, PortType.Mesh);
      var programPort = new InputPort(this, PortType.Program);

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
               ports[uniform.name] = new InputPort(self, uniform.type);
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

   return {
      "PortType": PortType,
      "Context": Context,
      "InputPort": InputPort,
      "OutputPort": OutputPort,
      "Node": Node,
      "ValueNode": ValueNode,
      "ImageNode": ImageNode,
      "MeshNode": MeshNode,
      "ShaderNode": ShaderNode,
      "ProgramNode": ProgramNode,
      "RenderNode": RenderNode,
      "dataURLWithTexture": dataURLWithTexture
   };

})(GLSLCreator || {});
