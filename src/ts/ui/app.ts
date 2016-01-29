import ShaderNode = require("../lib/ShaderNode");
import ProgramNode = require("../lib/ProgramNode");

export = function(gl: WebGLRenderingContext, container: HTMLElement) {
    // nodes should be initialized with an evaluation queue
    var vertexNode = new ShaderNode(gl, gl.VERTEX_SHADER);
    var fragmentNode = new ShaderNode(gl, gl.FRAGMENT_SHADER);
    var programNode = new ProgramNode(gl);

    programNode.vertexShaderPort().setProvider(vertexNode.shaderPort());
    vertexNode.shaderPort().addSink(programNode.vertexShaderPort());

    programNode.fragmentShaderPort().setProvider(fragmentNode.shaderPort());
    fragmentNode.shaderPort().addSink(programNode.fragmentShaderPort());

    vertexNode.setShaderSource("void main() {gl_Position = vec4(0.0, 0.0, 0.0, 0.0);}");
    fragmentNode.setShaderSource("void main() {gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);}");

    var node = document.createElement("p");
    node.innerHTML = "fsdaffdsa";
    container.appendChild(node);
}