const Node = require('./gt-node.js');
const Port = require('./gt-port.js');
const NodeTypes = require('./gt-node-types.js');

const ImageOutputNode = function(gl) {
   let texturePort = new Port.InputPort(this, gl.SAMPLER_2D);

   this._dirty = false;
   this._inputPorts = {
      "texture": texturePort
   };
   this._outputPorts = {};

   this.type = () => NodeTypes.ImageOutputNode;

   let _image;
   this.image = function() {
      return _image;
   };

   this.evaluate = function() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      const texture = texturePort.value();

      if (texture) {
         const quad = new Mesh(gl, new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0,  1.0
         ]), new Uint16Array([0, 1, 2, 3]), gl.TRIANGLE_STRIP);

         let vShader = gl.createShader(gl.VERTEX_SHADER);
         gl.shaderSource(vShader, "\
            attribute lowp vec2 iPos;\
            varying lowp vec2 vTexCoord;\
            void main(void) {\
               gl_Position = vec4(iPos, 0.0, 1.0);\
               vTexCoord = (iPos + vec2(1.0)) * 0.5;\
            }");
         gl.compileShader(vShader);

         let fShader = gl.createShader(gl.FRAGMENT_SHADER);
         gl.shaderSource(fShader, "\
            varying lowp vec2 vTexCoord;\
            uniform sampler2D tex;\
            void main(void) {\
               gl_FragColor = texture2D(tex, vTexCoord);\
            }");
         gl.compileShader(fShader);

         let program = gl.createProgram();
         gl.attachShader(program, vShader);
         gl.attachShader(program, fShader);
         gl.linkProgram(program);

         gl.useProgram(program);
         quad.use();

         let positionLoc = gl.getAttribLocation(program, "iPos");
         gl.enableVertexAttribArray(positionLoc);
         gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 8, 0);

         let textureLoc = gl.getUniformLocation(program, "uTex");
         gl.uniform1i(textureLoc, 0);
         gl.activeTexture(gl.TEXTURE0);
         gl.bindTexture(gl.TEXTURE_2D, texture);

         quad.draw();

         gl.deleteShader(vShader);
         gl.deleteShader(fShader);
         gl.deleteProgram(program);
         quad.delete();

         gl.disableVertexAttribArray(positionLoc);

         _image = gl.canvas.toDataURL();
      }
   };

};
ImageOutputNode.prototype = new Node();

module.exports = ImageOutputNode;
