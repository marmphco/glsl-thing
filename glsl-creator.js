var GLSLCreator = (function(exports) {

   var Context = function(element) {
      var gl = this.gl = element.getContext("webgl");
      console.log(gl.drawingBufferWidth);
      console.log(gl.canvas.height);

      gl.clearColor(0.0, 1.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

   /* PortType */
   var PortType = {
      "Number": "NumberPortType",
      "String": "StringPortType",
      "FragmentShader": "FragmentShaderPortType",
      "VertexShader": "VertexShaderPortType",
      "ShaderProgram": "ProgramPortType",
      "Texture": "TexturePortType",
      "Mesh": "MeshPortType"
   };

   /* InputPort */

   var InputPort = function(node, name, type) {
      var _node = node;
      var _name = name;
      var _type = type;
      var _provider = null;
      var self = this;

      this.name = function() {
         return _name;
      }

      this.type = function() {
         return _type;
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

   var OutputPort = function(node, name, type) {
      var _node = node;
      var _name = name;
      var _type = type;
      var _value;
      var _receivers = [];

      this.name = function() {
         return _name;
      }

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
      this.inputPorts = function() {
         return this._inputPorts;
      }

      this.outputPorts = function() {
         return this._outputPorts;
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

   var ValueNode = function(type) {
      var valuePort = new OutputPort(this, "value", type);

      this._dirty = false;
      this._inputPorts = [];
      this._outputPorts = [valuePort];

      this.setValue = function(value) {
         valuePort.exportValue(value);
      }

      this.evaluate = function() {}
   }
   ValueNode.prototype = new Node();

   var RenderNode = function(gl) {
      var meshPort = new InputPort(this, "mesh", PortType.Mesh);
      var programPort = new InputPort(this, "program", PortType.Program);

      this._dirty = false;
      this._inputPorts = [meshPort, programPort];
      this._outputPorts = [/* texture */];

      this.evaluate = function() {
         var mesh = meshPort.value();
         var program = programPort.value();
         gl.useProgram(program);
         mesh.use();

         // set up attributes and uniforms
         //cheating
         var positionLoc = gl.getAttribLocation(program, "iPosition");
         gl.enableVertexAttribArray(positionLoc);
         gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 12, 0);

         // draw to main renderbuffer for now
         mesh.draw();

      }
   }
   RenderNode.prototype = new Node();

   var Texture = function() {

   }

   /* MeshNode */
   var MeshNode = function(gl, vertices, indices, drawMode) {
      var meshPort = new OutputPort(this, "mesh", PortType.Mesh);
      meshPort.exportValue(new Mesh(gl, vertices, indices, drawMode));

      this._dirty = false;
      this._inputPorts = [];
      this._outputPorts = [
         meshPort,
      ];

      this.evaluate = function() {}
   }
   MeshNode.prototype = new Node();

   /* ShaderNode */
   var ShaderNode = function(gl, type) {
      var sourcePort = new InputPort(this, "source", PortType.String);

      var portType = type == gl.VERTEX_SHADER ?
         PortType.VertexShader : PortType.FragmentShader;
      var shaderPort = new OutputPort(this, "shader", portType);

      var _shader = gl.createShader(type);

      this._dirty = false;
      this._inputPorts = [sourcePort];
      this._outputPorts = [shaderPort];


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
      var vertexShaderPort = new InputPort(this, "vertex shader", PortType.VertexShader);
      var fragmentShaderPort = new InputPort(this, "fragment shader", PortType.FragmentShader);
      var programPort = new OutputPort(this, "program", PortType.Program);

      var _program = gl.createProgram();

      this._dirty = false;
      this._inputPorts = [vertexShaderPort, fragmentShaderPort];
      this._outputPorts = [programPort];

      this.evaluate = function() {
         // remove attached shaders
         var shaders = gl.getAttachedShaders(_program);
         shaders.forEach(function(shader) {
            gl.detachShader(_program, shader);
         });

         // attach new shaders
         gl.attachShader(_program, vertexShaderPort.value());
         gl.attachShader(_program, fragmentShaderPort.value());

         // link
         gl.linkProgram(_program);
         console.log("Program Link Errors: " + gl.getProgramInfoLog(_program));

         var x = gl.getProgramParameter(_program, gl.ACTIVE_ATTRIBUTES);
         console.log(x);
         console.log("active attributes:", gl.getActiveAttrib(_program, 0).name)

         //export
         programPort.exportValue(_program);
      }
   }
   ProgramNode.prototype = new Node();

   return {
      "PortType": PortType,
      "Context": Context,
      "InputPort": InputPort,
      "OutputPort": OutputPort,
      "Node": Node,
      "ValueNode": ValueNode,
      "MeshNode": MeshNode,
      "ShaderNode": ShaderNode,
      "ProgramNode": ProgramNode,
      "RenderNode": RenderNode
   };

})(GLSLCreator || {});
