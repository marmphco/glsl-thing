import Node = require("./Node");
import OutputPort = require("./OutputPort");
import InputPort = require("./InputPort");
import table = require("./table");
import Table = table.Table;

class ShaderNode implements Node {

    private _shaderPort: OutputPort<WebGLShader>;
    private _shaderSource: string;
    private _gl: WebGLRenderingContext;
    private _type: number;

    constructor(gl: WebGLRenderingContext, type: number) {
        this._shaderPort = new OutputPort();
        this._shaderSource = "";
        this._gl = gl;
        this._type = type; // needs validity check
    }

    delete() {
        const oldShader = this._shaderPort.value();
        if (oldShader) {
            this._gl.deleteShader(oldShader);
        }
    }

    shaderPort() {
        return this._shaderPort;
    }

    shaderSource() {
        return this._shaderSource;
    }

    setShaderSource(shaderSource: string) {
        this._shaderSource = shaderSource;
        this.pushValue();
    }

    inputPorts(): Table<InputPort<any>> {
        return {};
    }

    outputPorts(): Table<OutputPort<any>> {
        return {
            "shader": this._shaderPort
        }
    }

    pushValue(value: any = null) {
        const gl = this._gl;

        // delete previous shader if it exists
        const oldShader = this._shaderPort.value();
        if (oldShader) {
            gl.deleteShader(oldShader);
        }

        // compile the shader
        var shader = gl.createShader(this._type);
        gl.shaderSource(shader, this._shaderSource);
        gl.compileShader(shader);

        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("Shader Compiled Successfully");
            this._shaderPort.setValue(shader);
        }
        else {
            console.log("Shader Failed to Compile:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
    }

    toJSON(): any {

    }
}

export = ShaderNode;