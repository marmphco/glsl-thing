import {PortType, BaseType} from "../lib/PortType";
import RenderGraph from "../lib/RenderGraph";
import ShaderNode = require("../lib/ShaderNode");
import ProgramNode = require("../lib/ProgramNode");
//import RenderNode = require("../lib/RenderNode");
//import {MeshNode} from "../lib/MeshNode";
//import {Square} from "../lib/Primitive";

export = function(gl: WebGLRenderingContext, container: HTMLElement) {

    var graph = new RenderGraph();

    const vertexNode = new ShaderNode(gl, BaseType.VertexShader);
    const fragmentNode = new ShaderNode(gl, BaseType.FragmentShader);
    const programNode = new ProgramNode(gl);

    const vertexNodeID = graph.addNode(vertexNode);
    const fragmentNodeID = graph.addNode(fragmentNode);
    const programID = graph.addNode(programNode);

    graph.bind({
        sender: { node: vertexNodeID, port: "shader" },
        receiver: { node: programID, port: "vertexShader" }
    });

    graph.bind({
        sender: { node: fragmentNodeID, port: "shader" },
        receiver: { node: programID, port: "fragmentShader" }
    });

    vertexNode.setShaderSource("\
        attribute lowp vec4 aPosition;\
        attribute lowp vec4 aColor;\
        void main() {\
            gl_Position = aPosition;\
        }");

    graph.evaluateSubgraphAtNodeWithID(vertexNodeID);

    fragmentNode.setShaderSource("\
        void main() {\
            gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\
        }");

    graph.evaluateSubgraphAtNodeWithID(fragmentNodeID);

    var node = document.createElement("p");
    node.innerHTML = "fsdaffdsa";
    container.appendChild(node);
}