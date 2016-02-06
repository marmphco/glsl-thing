// import Node = require("./Node");
// import OutputPort = require("./OutputPort");
// import InputPort = require("./InputPort");
// import table = require("./table");
// import Table = table.Table;
// import {Mesh, MeshAttributeBinder} from './Mesh';

// class RenderNode implements Node {

//     private _gl: WebGLRenderingContext;
//     private _meshPort: InputPort<Mesh>;
//     private _programPort: InputPort<WebGLProgram>;
//     private _texturePort: OutputPort<WebGLTexture>;

//     private _attributePorts: Table<InputPort<MeshAttributeBinder>>;
//     private _uniformPorts: Table<InputPort<any>>;

//     constructor(gl: WebGLRenderingContext) {

//         this._gl = gl;
//         this._attributePorts = {};
//         this._uniformPorts = {};

//         this._meshPort = new InputPort<Mesh>(this);
//         this._programPort = new InputPort<WebGLProgram>(this);
//     }

//     meshPort(): InputPort<Mesh> {
//         return this._meshPort;
//     }

//     programPort(): InputPort<WebGLProgram> {
//         return this._programPort;
//     }

//     texturePort(): OutputPort<WebGLTexture> {
//         return this._texturePort;
//     }

//     inputPorts(): Table<InputPort<any>> {
//         return table.merge({
//             "mesh": this._meshPort,
//             "program": this._programPort
//         }, 
//         this._uniformPorts, 
//         this._attributePorts);
//     }

//     outputPorts(): Table<OutputPort<any>> {
//         return {
//             "texture": this._texturePort
//         };
//     }

//     pushValue(value: any = null) {
//         const gl = this._gl;

//         const program = this._programPort.value();

//         if (value === program) {
//             console.log("Generating new attribute ports");
//             const activeAttributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

//             var newPorts: Table<InputPort<MeshAttributeBinder>> = {};
//             for (var attributeLoc = 0; attributeLoc < activeAttributeCount; attributeLoc++) {
//                 const attribute = gl.getActiveAttrib(program, attributeLoc);

//                 // merge ports
//                 if (attribute.name in this._attributePorts) {
//                     newPorts[attribute.name] = this._attributePorts[attribute.name];
//                 }
//                 else {
//                     newPorts[attribute.name] = new InputPort<MeshAttributeBinder>(this);
//                 }
//             }

//             // clean up unused ports
//             for (const attributeName in this._attributePorts) {
//                 if (!(attributeName in newPorts)) {
//                     // unbind
//                 }
//             }

//             this._attributePorts = newPorts;
//         } 

//         if (program) {
//             // setup attributes
//             console.log("Binding Attributes");
//             for (const attributeName in this._attributePorts) {
//                 const binder = this._attributePorts[attributeName].value();
//                 if (binder) {
//                     const attributeLoc = gl.getAttribLocation(program, attributeName);
//                     binder(attributeLoc);
//                 }
//             }

//             // setup uniforms
//             for (const uniformName in this._uniformPorts) {

//             }

//             // bind program
//             gl.useProgram(program);

//             // draw the mesh to texture
//             console.log("Drawing Mesh");
//             const mesh = this._meshPort.value();
//             mesh.draw();
//         }
//     }

//     toJSON(): any {

//     }
// }

// export = RenderNode;