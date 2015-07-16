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
   ImageOutputNode: require('./gt-image-output-node.js'),
   Context: function(element) {
      var gl = this.gl = element.getContext("webgl", {
         preserveDrawingBuffer: true
      });
   },
   dataURLWithTexture: function(gl, texture) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      var quad = new Mesh(gl, gl.TRIANGLE_STRIP, 'indices',  {
         indices: [0, 1, 2, 3],
         positions: [
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0,  1.0
         ]
      },  {
         iPos: {
            key: 'positions',
            dimension: 2,
            stride: 8,
            offset: 0
         }
      });

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

      var textureLoc = gl.getUniformLocation(program, "uTex");
      gl.uniform1i(textureLoc, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      quad.draw(program);

      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteProgram(program);
      quad.delete();

      return gl.canvas.toDataURL();
   }
};