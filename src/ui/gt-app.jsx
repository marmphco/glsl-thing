var React = require('react');
var update = require('react/lib/update');
var AceEditor = require('react-ace');
var Workspace = require('../ui/gt-workspace.jsx');
var GLSLThing = require('../lib/glsl-thing.js');
var NodeTypes = require('../lib/gt-node-types.js');
var PortTypes = require('../lib/gt-port.js').PortType;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var Button = require('react-bootstrap').Button;

require('brace/mode/glsl');
require('brace/theme/solarized_dark');

var nodeConstructors = {
    'Source': (gl) => {
        let node = new GLSLThing.ValueNode(PortTypes.String);
        node.setValue("shader");
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
        node.setValue("placeholder image node");
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
    }
};

var App = React.createClass({
    propTypes: {
        glContext: React.PropTypes.instanceOf
    },
    getInitialState: function() {
        return {
            nodes: {},
            bindings: [],
            editorText: '',
            selectedNode: null,
            uid: 0
        };
    },
    addNode: function(node) {
        this.setState({
            nodes: update(this.state.nodes, {
                [this.state.uid.toString()]: {$set: node}
            })
        });

        return this.state.uid++;
    },
    addBinding: function(inputNodeID, inputPortName, outputNodeID, outputPortName) {
        const inputNode = nodes[inputNodeID];
        const inputPort = inputNode.inputPort(inputPortName);
        const outputNode = nodes[outputNodeID];
        const outputPort = outputNode.outputPort(outputPortName);

        inputPort.bindTo(outputPort);

        this.setState({
            bindings: this.state.bindings.concat([{
                input: {id: inputNode, port: inputPort},
                output: {id: outputNode, port: outputPort}
            }])
        });
    },
    handleAddNode: function(key) {
        console.log(key);
        this.addNode(nodeConstructors[key](this.props.glContext));
    },
    handleNodeSelected: function(node) {
        if (node.type() == NodeTypes.ValueNode) {
            if (node.outputPort('value').type() == PortTypes.String) {
                this.setState({
                    editorText: node.outputPort('value').value(),
                    selectedNode: node
                });
            }
        }
    },
    handleNodeDeselected: function(node) {
        this.setState({
            editorText: '',
            selectedNode: null
        })
    },
    handleEditorChanged: function(newValue) {
        if (this.state.selectedNode) {
            this.state.selectedNode.setValue(newValue);
            setTimeout(() => {
               console.log('render');
               //document.getElementById('output').src = GLSLThing.dataURLWithTexture(gl, renderNode.outputPort('renderedImage').value());
            }, 500); // artificial delay
         }
    },
    render: function() {
        return (
            <div>
                <div className='gt-workspace'>
                    <Workspace nodes={this.state.nodes}
                               bindings={this.state.bindings} 
                               onNodeSelected={this.handleNodeSelected}
                               onNodeDeselected={this.handleNodeDeselected} />
                </div>
                <div className='gt-shader-editor'>
                    <AceEditor mode='glsl'
                               theme='solarized_dark'
                               name='code-editor' 
                               width='100%'
                               height='100%' 
                               value={this.state.editorText}
                               onChange={this.handleEditorChanged} />
                </div>
                <DropdownButton bsStyle="default" title="Add Node" onSelect={this.handleAddNode}>
                    {Object.keys(nodeConstructors).map(key => <MenuItem eventKey={key}>{key}</MenuItem>)}
                </DropdownButton>
            </div>
        );
    }
});

module.exports = App;