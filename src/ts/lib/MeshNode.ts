import Node = require("./Node");
import OutputPort = require("./OutputPort");
import InputPort = require("./InputPort");
import table = require("./table");
import Table = table.Table;
import {MeshAttributes, Mesh} from './Mesh';

export class MeshNode implements Node {

    private _gl: WebGLRenderingContext;
    private _meshPort: OutputPort<Mesh>;
    private _outputPorts: Table<OutputPort<any>>;

    constructor(gl: WebGLRenderingContext, mesh: Mesh) {

        this._gl = gl;
        this._outputPorts = {};

        this._meshPort = new OutputPort<Mesh>();
        this._meshPort.setValue(mesh);

        this._outputPorts["mesh"] = this._meshPort;

        mesh.attributeNames().forEach((attributeName) => {
            var port = new OutputPort<any>();
            port.setValue(mesh.attributeBindingFunction(attributeName));

            this._outputPorts['attr:' + attributeName] = port;
        });
    }

    meshPort(): OutputPort<Mesh> {
        return this._meshPort;
    }

    inputPorts(): Table<InputPort<any>> {
        return {};
    }

    outputPorts(): Table<OutputPort<any>> {
        return this._outputPorts;
    }

    pushValue(value: any = null) {
        
    }

    toJSON(): any {

    }
}
