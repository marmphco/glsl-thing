import {assert} from "./Assert";
import Node = require("./Node");
import {BaseType, PortType} from "./PortType";
import table = require("./table");
import Table = table.Table;
import {MeshAttributes, Mesh} from './Mesh';

// class MeshNode implements Node {

//     private _gl: WebGLRenderingContext;
//     private _ports: Table<PortType>;

//     private _mesh: Mesh;

//     constructor(gl: WebGLRenderingContext, mesh: Mesh) {
//         this._gl = gl;
//         this._mesh = mesh;
//         this._ports = {
//             "mesh": BaseType.Mesh
//         };

//         mesh.attributeNames().forEach((attributeName) => {

//             this._ports[attributeName] = 

//             var port = new OutputPort<any>();
//             port.setValue(mesh.attributeBindingFunction(attributeName));

//             this._attributePorts['attr:' + attributeName] = port;
//         });
//     }

//     inputPorts(): Table<PortType> {
//         return {};
//     }

//     outputPorts(): Table<PortType> {
//         const defaultPorts: Table<PortType> = {
//             "mesh": PortType.Mesh
//         };

//         return table.merge(defaultPorts, this._attributePorts);
//     }

//     evaluate(inputs: Table<any>): Table<any> {
//         mesh.attributeNames().forEach((attributeName) => {
//             var port = new OutputPort<any>();
//             port.setValue(mesh.attributeBindingFunction(attributeName));

//             this._attributePorts['attr:' + attributeName] = port;
//         });
//         return attributes;
//     }
// }

// export = MeshNode;

// export class MeshNode implements Node {

//     private _gl: WebGLRenderingContext;
//     private _meshPort: OutputPort<Mesh>;
//     private _outputPorts: Table<OutputPort<any>>;

//     constructor(gl: WebGLRenderingContext, mesh: Mesh) {

//         this._gl = gl;
//         this._outputPorts = {};

//         this._meshPort = new OutputPort<Mesh>();
//         this._meshPort.setValue(mesh);

//         this._outputPorts["mesh"] = this._meshPort;

//         mesh.attributeNames().forEach((attributeName) => {
//             var port = new OutputPort<any>();
//             port.setValue(mesh.attributeBindingFunction(attributeName));

//             this._outputPorts['attr:' + attributeName] = port;
//         });
//     }

//     meshPort(): OutputPort<Mesh> {
//         return this._meshPort;
//     }

//     inputPorts(): Table<InputPort<any>> {
//         return {};
//     }

//     outputPorts(): Table<OutputPort<any>> {
//         return this._outputPorts;
//     }

//     pushValue(value: any = null) {
        
//     }

//     toJSON(): any {

//     }
// }
