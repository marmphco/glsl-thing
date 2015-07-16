var GLSLThing = require('../lib/glsl-thing.js');
var PortTypes = require('../lib/gt-port.js').PortType;

module.exports = {
    'Source': (gl) => {
        let node = new GLSLThing.ValueNode(PortTypes.String);
        node.setValue('void main(void) {\n\n}');
        return node;
    },
    'Scalar': (gl) => {
        return new GLSLThing.ValueNode(PortTypes.Number);
    },
    'Mesh': (gl) => {
        // default placeholder square mesh for now
        var vertices = new Float32Array([
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, 1.0, 0.0
        ]);
        var indices = new Uint16Array([0, 1, 2, 3]);

        return new GLSLThing.MeshNode(gl, vertices, indices, gl.TRIANGLE_STRIP);
    },
    'Image': (gl) => {
        // PlaceHolder
        let node = new GLSLThing.ValueNode(PortTypes.String);
        node.setValue('placeholder image node');
        return node;
    },
    'VertexShader': (gl) => {
        return new GLSLThing.ShaderNode(gl, gl.VERTEX_SHADER);
    },
    'FragmentShader': (gl) => {
        return new GLSLThing.ShaderNode(gl, gl.FRAGMENT_SHADER);
    },
    'Program': (gl) => {
        return new GLSLThing.ProgramNode(gl);
    },
    'Render': (gl) => {
        return new GLSLThing.RenderNode(gl);
    },
    'Viewer': (gl) => {
        return new GLSLThing.ImageOutputNode(gl);
    }
};
