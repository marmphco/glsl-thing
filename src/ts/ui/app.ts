import ShaderNode = require("../lib/ShaderNode");
import ProgramNode = require("../lib/ProgramNode");
import RenderNode = require("../lib/RenderNode");
import {MeshNode} from "../lib/MeshNode";
import {Square} from "../lib/Primitive";

export = function(gl: WebGLRenderingContext, container: HTMLElement) {
    // nodes should be initialized with an evaluation queue
    var vertexNode = new ShaderNode(gl, gl.VERTEX_SHADER);
    var fragmentNode = new ShaderNode(gl, gl.FRAGMENT_SHADER);
    var programNode = new ProgramNode(gl);

    programNode.vertexShaderPort().setProvider(vertexNode.shaderPort());
    vertexNode.shaderPort().addSink(programNode.vertexShaderPort());

    programNode.fragmentShaderPort().setProvider(fragmentNode.shaderPort());
    fragmentNode.shaderPort().addSink(programNode.fragmentShaderPort());

    vertexNode.setShaderSource("\
        attribute lowp vec4 aPosition;\
        attribute lowp vec4 aColor;\
        void main() {\
            gl_Position = aPosition;\
        }");

    fragmentNode.setShaderSource("\
        void main() {\
            gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\
        }");

    var meshNode = new MeshNode(gl, Square(gl));

    var renderNode = new RenderNode(gl);

    renderNode.meshPort().setProvider(meshNode.meshPort());
    meshNode.meshPort().addSink(renderNode.meshPort());

    renderNode.programPort().setProvider(programNode.programPort());
    programNode.programPort().addSink(renderNode.programPort());

    console.log(renderNode.inputPorts());


    var node = document.createElement("p");
    node.innerHTML = "fsdaffdsa";
    container.appendChild(node);
}