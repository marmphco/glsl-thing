var GLSLCreator = (function(exports) {

   var Context = function(element) {
      var gl = this.gl = element.getContext("webgl");
      console.log(gl.drawingBufferWidth);
      console.log(gl.canvas.height);

      gl.clearColor(0.0, 1.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, document.getElementById("test-vertex-shader").firstChild.textContent);
      gl.compileShader(vertexShader);

      var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, document.getElementById("test-fragment-shader").firstChild.textContent);
      gl.compileShader(fragmentShader);

      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      console.log(gl.getShaderInfoLog(vertexShader));
      console.log(gl.getShaderInfoLog(fragmentShader));
      console.log(gl.getProgramInfoLog(program));

      gl.useProgram(program);

      var squareVertices = new Float32Array([
         0.0, 0.0, 0.0,
         1.0, 0.0, 0.0,
         0.0, 1.0, 0.0,
         1.0, 1.0, 0.0
      ]);
      var squareBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);

      var positionLoc = gl.getAttribLocation(program, "iPosition");
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 12, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);



   }

   /* PortType */
   var PortType = {
      "Number": "NumberPortType",
      "FragmentShader": "FragmentShaderPortType",
      "VertexShader": "VertexShaderPortType",
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

      this.hasProvider = function() {
         return _provider != null;
      }

      this.provider = function() {
         return _provider;
      }

      this.bindTo = function(outputPort) {
         if (self.hasProvider()) {
            _provider.removeReceiver(self);
         }
         _provider = outputPort;
         _provider.addReceiver(self);
         self.markDirty();
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
         setTimeout(_node.evaluate, 0);
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
         _value = value;
         _receivers.forEach(function(receiver) {
            receiver.markDirty();
         });
      }
   }

   /* Node */

   var Node = function() {
      var _inputPorts = [];
      var _outputPorts = [];
      var _dirty = false;

      this.addInputPort = function(port) {
         _inputPorts.push(port);
      }

      this.addOutputPort = function(port) {
         _outputPorts.push(port);
      }

      this.inputPorts = function() {
         return _inputPorts;
      }

      this.outputPorts = function() {
         return _outputPorts;
      }

      this.markDirty = function() {
         _dirty = true;
      }

      this.evaluate = function() {
         if (_dirty) {
            console.log("Evaluating node...");
            _inputPorts.forEach(function(port) {
               console.log(port.name() + ": " + port.value());
            });
         }
         _dirty = false;
      }
   }

   var RenderPass = function() {

   }

   var Texture = function() {

   }

   var Mesh = function() {

   }

   /* ShaderNode */

   var _ShaderNode = new Node();
   _ShaderNode.compile = function() {

   }
   var ShaderNode = function(sourceString) {

   }
   ShaderNode.prototype = _ShaderNode;

   /* ShaderProgram */

   var ShaderProgram = function() {


   }

   return {
      "PortType": PortType,
      "Context": Context,
      "InputPort": InputPort,
      "OutputPort": OutputPort,
      "Node": Node,
      "ShaderNode": ShaderNode,
   };

})(GLSLCreator || {});
