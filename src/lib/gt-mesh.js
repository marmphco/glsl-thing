/*
   Buffers is an object of numerical arrays
   Attribute Definition
   {
      key: String,
      dimension: Number,
      offset: Number,
      stride: Number
   }

   attribute types are hardcoded to gl.FLOAT for now
*/
class Mesh {
   constructor(gl, drawMode, elementArrayKey, arrays, attributes) {
      this._gl = gl;
      this._drawMode = drawMode;
      this._attributes = attributes;
      this._elementArrayKey = elementArrayKey;
      this._elementCount = arrays[elementArrayKey].length;

      this._buffers = {};
      // set up vertex array buffers
      for (let attributeName in attributes) {
         let attribute = attributes[attributeName];

         let buffer = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays[attribute.key]), gl.STATIC_DRAW);

         this._buffers[attribute.key] = buffer;
      }

      // set up element array buffer
      let elementBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrays[elementArrayKey]), gl.STATIC_DRAW);
      this._buffers[elementArrayKey] = elementBuffer;
   }

   delete() {
      // delete buffers
      for (let bufferName in this._buffers) {
         this._gl.deleteBuffer(this._buffers[bufferName]);
      }
   }

   draw(program) {
      const gl = this._gl;

      // enable vertex attribute arrays
      for (let attributeName in this._attributes) {
         let attribute = this._attributes[attributeName];

         let buffer = this._buffers[attribute.key];
         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

         let attributeLoc = gl.getAttribLocation(program, attributeName);
         gl.enableVertexAttribArray(attributeLoc);
         gl.vertexAttribPointer(attributeLoc,
                                attribute.dimension,
                                gl.FLOAT, 
                                false,
                                attribute.stride,
                                attribute.offset);
      }

      // bind element array buffer
      let elementBuffer = this._buffers[this._elementArrayKey];
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);

      // do the actual drawing
      gl.drawElements(this._drawMode, this._elementCount, gl.UNSIGNED_SHORT, 0);

      // disable vertex attribute arrays
      for (let attributeName in this._attributes) {
         let attributeLoc = gl.getAttribLocation(program, attributeName);
         gl.disableVertexAttribArray(attributeLoc);
      }
   }
}

module.exports = Mesh;
