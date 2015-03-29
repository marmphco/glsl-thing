var GLSLThing = (function(gt) {

   /*
      Renders @texture to the draw buffer, then uses
      toDataURL() to extract the dataURL.

      Really slow, creates and destroys buffers and
      shaders during each execution.
   */
   var dataURLWithTexture = function(gl, texture) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      var quad = new gt.Mesh(gl, new Float32Array([
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

   gt.Context = Context;
   gt.dataURLWithTexture = dataURLWithTexture;
   return gt;

})(GLSLThing || {});
