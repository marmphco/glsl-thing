/* PortTypes that have no OpenGL analog */
var PortType = {
   "String": "String",
   "FragmentShader": "FragmentShader",
   "VertexShader": "VertexShader",
   "ShaderProgram": "Program",
   "Mesh": "Mesh"
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
         return true;
      }
      else {
         console.warn(
            "Incompatible port types in binding: "
            + outputPort.type()
            + " => "
            + _type);
         return false;
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
      // enqueue the owning node to be cleaned
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

module.exports = {
   "PortType": PortType,
   "InputPort": InputPort,
   "OutputPort": OutputPort
}