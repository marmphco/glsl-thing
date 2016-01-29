import Node = require("./Node");
import OutputPort = require("./OutputPort");
import InputPort = require("./InputPort");
import table = require("./table");
import Table = table.Table;

class ProgramNode implements Node {

    private _vertexShaderPort: InputPort<WebGLShader>;
    private _fragmentShaderPort: InputPort<WebGLShader>;
    private _programPort: OutputPort<WebGLProgram>;
    private _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this._vertexShaderPort = new InputPort(this);
        this._fragmentShaderPort = new InputPort(this);
        this._programPort = new OutputPort();
        this._gl = gl;
    }

    vertexShaderPort() {
        return this._vertexShaderPort;
    }

    fragmentShaderPort() {
        return this._fragmentShaderPort;
    }

    programPort() {
        return this._programPort;
    }

    inputPorts(): Table<InputPort<any>> {
        return {
            "Vertex Shader": this._vertexShaderPort,
            "Fragment Shader": this._fragmentShaderPort
        };
    }

    outputPorts(): Table<OutputPort<any>> {
        return {
            "Program": this._programPort
        }
    }

    pushValue(value: any = null) {
        const gl = this._gl;

        // delete previous program if it exists
        const oldProgram = this._programPort.value();
        if (oldProgram) {
            gl.deleteProgram(oldProgram);
        }
        
        var vertexShader = this._vertexShaderPort.value();
        var fragmentShader = this._fragmentShaderPort.value();        
        if (vertexShader && fragmentShader) {
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.log("Program Linked Successfully");
                this._programPort.setValue(program);
            }
            else {
                console.log("Program Failed to Link:", gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
            }
        }
    }

    toJSON(): any {

    }
}

export = ProgramNode;