/// <reference path="../typings/jasmine/jasmine.d.ts" />

import ShaderNode = require("../lib/ShaderNode");

describe("ShaderNode", function() {
    var gl: WebGLRenderingContext;
    var vertexShaderNode: ShaderNode;
    var fragmentShaderNode: ShaderNode;

    // beforeEach(() => {
    //     var canvas = document.createElement("canvas");
    //     gl = canvas.getContext("experimental-webgl");

    //     vertexShaderNode = new ShaderNode(gl, gl.VERTEX_SHADER);
    //     fragmentShaderNode = new ShaderNode(gl, gl.FRAGMENT_SHADER);

    // })

    // it("can be converted to JSON", function() {
    //     expect(false).toBeTruthy();
    // });

    // it("has a shader output port", function() {
    //     expect(vertexShaderNode.shaderPort).not.toBeNull();
    // })

    // it("evaluates properly", function() {
    //     var vertexShaderNode = new ShaderNode(gl, gl.VERTEX_SHADER);


    // });
});
