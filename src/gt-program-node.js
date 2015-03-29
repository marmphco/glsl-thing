var GLSLThing = (function(gt) {

   /* ProgramNode */

   var ProgramNode = function(gl) {
      var vertexShaderPort = new gt.InputPort(this, gt.PortType.VertexShader);
      var fragmentShaderPort = new gt.InputPort(this, gt.PortType.FragmentShader);
      var programPort = new gt.OutputPort(this, gt.PortType.Program);

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
   ProgramNode.prototype = new gt.Node();

   gt.ProgramNode = ProgramNode;
   return gt;

})(GLSLThing || {});
