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
        return new GLSLThing.MeshNode(gl, gl.TRIANGLE_STRIP, 'indices', {
            indices: [0, 1, 2, 3],
            positions: [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0
            ]
        }, {
            positions: {
                key: 'positions',
                dimension: 3,
                stride: 12,
                offset: 0
            }
        });
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
