import {assert} from "./Assert";
import Node = require("./Node");
import {BaseType} from "./PortType";
import table = require("./table");
import Table = table.Table;

class ProgramNode implements Node {
    private _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

//     delete() {
//         const oldProgram = this._programPort.value();
//         if (oldProgram) {
//             this._gl.deleteProgram(oldProgram);
//         }
//     }
    
    inputPorts(): Table<BaseType> {
        return {
            "vertexShader": BaseType.VertexShader,
            "fragmentShader": BaseType.FragmentShader
        }
    }

    outputPorts(): Table<BaseType> {
        return {
            "program": BaseType.ShaderProgram
        }
    }

    evaluate(inputs: Table<any>): Table<any> {
        assert("vertexShader" in inputs);
        assert("fragmentShader" in inputs);
        const gl = this._gl;

        var vertexShader = inputs["vertexShader"];
        var fragmentShader = inputs["fragmentShader"];        
        if (vertexShader && fragmentShader) {
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.log("Program Linked Successfully");

                return {
                    "program": program
                };
            }
            else {
                // should use custom logger
                console.log("Program Failed to Link:", gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return {};
            }
        }
    }
}

export = ProgramNode;