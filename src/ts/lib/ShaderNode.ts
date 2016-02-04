import Node = require("./Node");
import PortType = require("./PortType");
import {assert} from "./Assert";
import table = require("./table");
import Table = table.Table;

class ShaderNode implements Node {

    private _gl: WebGLRenderingContext;
    private _type: PortType;

    private _shaderSource: string;

    constructor(gl: WebGLRenderingContext, type: PortType) {
        assert(type === PortType.VertexShader || type === PortType.FragmentShader);

        this._gl = gl;
        this._type = type;
    }

//     delete() {
//         const oldShader = this._shaderPort.value();
//         if (oldShader) {
//             this._gl.deleteShader(oldShader);
//         }
//     }

    setShaderSource(source: string) {
        this._shaderSource = source;
    }

    shaderSource(): string {
        return this._shaderSource;
    }

    inputPorts(): Table<PortType> {
        return {};
    }

    outputPorts(): Table<PortType> {
        return {
            "shader": this._type
        }
    }

    evaluate(inputs: Table<any>): Table<any> {
        const gl = this._gl;

        // compile the shader
        const glType = this._type == PortType.VertexShader ?
            gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;

        var shader = gl.createShader(glType);
        gl.shaderSource(shader, this._shaderSource);
        gl.compileShader(shader);

        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("Shader Compiled Successfully");
            return {
                "shader": shader
            }
        }
        else {
            console.log("Shader Failed to Compile:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);

            return {};
        }

        
    }
}

export = ShaderNode;