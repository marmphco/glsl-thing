var Mesh = require('./gt-mesh.js');

module.exports = {
   ImageNode: require("./gt-image-node.js"),
   MeshNode: require("./gt-mesh-node.js"),
   Mesh: require('./gt-mesh.js'),
   Node: require('./gt-node.js'),
   Port: require('./gt-port.js'),
   ProgramNode: require('./gt-program-node.js'),
   RenderNode: require('./gt-render-node.js'),
   ShaderNode: require('./gt-shader-node.js'),
   ValueNode: require('./gt-value-node.js'),
   Context: function(element) {
      var gl = this.gl = element.getContext("webgl", {
         preserveDrawingBuffer: true
      });
   },
   dataURLWithTexture: function(gl, texture) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      var quad = new Mesh(gl, new Float32Array([
         -1.0, -1.0,
          1.0, -1.0,
         -1.0,  1.0,
          1.0,  1.0
      ]), new Uint16Array([0, 1, 2, 3]), gl.TRIANGLE_STRIP);

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
};