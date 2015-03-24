var GLSLCreator = (function(exports) {

   exports.Context = function(element) {
      var gl = this.gl = element.getContext("webgl");
      console.log(gl.drawingBufferWidth);
      console.log(gl.canvas.height);

      gl.clearColor(0.0, 1.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      var squareVertices = new Float32Array([
         0.0, 0.0, 0.0,
         1.0, 0.0, 0.0,
         0.0, 1.0, 0.0,
         1.0, 1.0, 0.0
      ]);

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


      var squareBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);

      var positionLoc = gl.getAttribLocation(program, "iPosition");
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 12, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
   }

   exports.RenderPass = function() {

   }

   exports.Texture = function() {

   }

   exports.Mesh = function() {

   }

   exports.ShaderProgram = function() {


   }

   return exports;

})(GLSLCreator || {});

