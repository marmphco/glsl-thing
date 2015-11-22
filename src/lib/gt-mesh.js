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

      // purely for serialization
      this._arrays = arrays;

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

   attributeNames() {
      return Object.keys(this._attributes);
   }

   /* 
      Returns a function that binds an attribute of the mesh
      to a vertex attribute of a shader program.
   */
   attributeBindingFunction(name) {
      const gl = this._gl;
      const attribute = this._attributes[name];
      const buffer = this._buffers[attribute.key];

      return function(attributeLoc) {
         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
         gl.enableVertexAttribArray(attributeLoc);
         gl.vertexAttribPointer(attributeLoc,
                                attribute.dimension,
                                gl.FLOAT, 
                                false,
                                attribute.stride,
                                attribute.offset);
      }
   }

   draw() {
      const gl = this._gl;

      // bind element array buffer
      let elementBuffer = this._buffers[this._elementArrayKey];
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);

      // do the actual drawing
      gl.drawElements(this._drawMode, this._elementCount, gl.UNSIGNED_SHORT, 0);
   }

   toJSON() {
      return {
         'drawMode': this._drawMode,
         'elementArrayKey': this._elementArrayKey,
         'arrays': this._arrays,
         'attributes': this._attributes
      };
   }
}

module.exports = Mesh;
