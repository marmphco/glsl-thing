var React = require('react');
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

var nodeTypes = [
   /* ['Source', GLSLThing.ValueNode ],
    ['Scalar', GLSLThing.ValueNode ],
    ['Mesh', GLSLThing.MeshNode ],
    ['Image', GLSLThing.ImageNode ],
    ['Shader', GLSLThing.ValueNode ],
    ['Program', GLSLThing.ValueNode ],
    ['Render', GLSLThing.ValueNode ],*/
];

var App = React.createClass({
    propTypes: {
        glContext: React.PropTypes.instanceOf
    },
    getInitialState: function() {
        return {
            nodes: [],
            bindings: [],
            editorText: ""
        };
    },
    addNode: function(node) {
        this.setState({
            nodes: this.state.nodes.concat([node])
        });
        return this.state.nodes.length - 1;
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
    handleAddNode: function() {
        console.log("adds node");
        const node = new GLSLThing.ValueNode(GLSLThing.Port.PortType.String);
        this.addNode(node);
    },
    handleNodeSelected: function() {

    },
    handleNodeDeselected: function() {

    },
    handleEditorChanged: function() {

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
                    <MenuItem eventKey='Source'>Source</MenuItem>
                    <MenuItem eventKey='Scalar'>Scalar</MenuItem>
                    <MenuItem eventKey='Mesh'>Mesh</MenuItem>
                    <MenuItem eventKey='Image'>Image</MenuItem>
                    <MenuItem eventKey='Shader'>Shader</MenuItem>
                    <MenuItem eventKey='Program'>Program</MenuItem>
                    <MenuItem eventKey='Render'>Render</MenuItem>
                </DropdownButton>
            </div>
        );
    }
});

module.exports = App;