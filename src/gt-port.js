var GLSLCreator = (function(gt) {

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

   gt.PortType = PortType;
   gt.InputPort = InputPort;
   gt.OutputPort = OutputPort;
   return gt;

})(GLSLCreator || {});
