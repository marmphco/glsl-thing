var React = require('react');
var update = require('react/lib/update');
var AceEditor = require('react-ace');
var GLSLThing = require('../lib/glsl-thing.js');
var NodeTypes = require('../lib/gt-node-types.js');
var PortTypes = require('../lib/gt-port.js').PortType;

var Workspace = require('./gt-workspace.jsx');
var NodeConstructors = require('./gt-node-constructors.js');

var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Button = require('react-bootstrap').Button;

require('brace/mode/glsl');
require('brace/theme/solarized_dark');

var App = React.createClass({
    propTypes: {
        glContext: React.PropTypes.instanceOf
    },
    getInitialState: function() {
        return {
            nodes: {},
            bindings: [],
            editorText: '',
            selectedNodeID: null,
            viewerImageData: '',
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
    removeNodeWithID: function(id) {
        // remove any bindings concerning this node
        this.state.bindings.forEach((binding) => {
            if (binding.input.id == id || binding.output.id == id) {
                this.removeBinding(binding.input.id, binding.input.port);
            }
        });

        // remove the node
        delete this.state.nodes[id];
        this.setState({
            nodes: this.state.nodes,
        });
    },
    addBinding: function(inputNodeID, inputPortName, outputNodeID, outputPortName) {
        const inputNode = this.state.nodes[inputNodeID];
        const inputPort = inputNode.inputPort(inputPortName);
        const outputNode = this.state.nodes[outputNodeID];
        const outputPort = outputNode.outputPort(outputPortName);

        if (inputPort.bindTo(outputPort)) {
            this.setState({
                bindings: this.state.bindings.concat([{
                    input: {id: inputNodeID, port: inputPortName},
                    output: {id: outputNodeID, port: outputPortName}
                }])
            });
        }
    },
    removeBinding: function(inputNodeID, inputPortName) {
        this.state.nodes[inputNodeID].inputPort(inputPortName).unbind();

        // slow but easy to comprehend
        this.setState((previousState, currentProps) => {
            return {
                bindings: previousState.bindings.filter((binding) => {
                    return binding.input.id != inputNodeID || binding.input.port != inputPortName;
                })
            }
        });
    },
    handleAddNode: function(key) {
        console.log(key);
        this.addNode(NodeConstructors[key](this.props.glContext));
    },
    handleRemoveNode: function() {
        this.removeNodeWithID(this.state.selectedNodeID);
        this.setState({
            selectedNodeID: null
        });
    },
    handleNodeSelected: function(id) {
        const node = this.state.nodes[id];
        switch (node.type()) {
            case NodeTypes.ValueNode:
                if (node.outputPort('value').type() == PortTypes.String) {
                    this.setState({
                        editorText: node.outputPort('value').value(),
                        viewerImageData: ''
                    });
                }
                else {
                    this.setState({
                        editorText: '',
                        viewerImageData: ''
                    });
                }
                break;
            case NodeTypes.RenderNode:
                const texture = node.outputPort('renderedImage').value();
                const dataURL = GLSLThing.dataURLWithTexture(this.props.glContext, texture);
                this.setState({
                    viewerImageData: dataURL
                });
            default: break;
        }

        this.setState({
            selectedNodeID: id
        });
    },
    handleBackgroundSelected: function() {
        this.setState({
            editorText: '',
            selectedNodeID: null,
            viewerImageData: ""
        })
    },
    handlePortsConnected: function(inputNodeID, inputPortName, outputNodeID, outputPortName) {
        this.addBinding(inputNodeID, inputPortName, outputNodeID, outputPortName);
    },
    handleEditorChanged: function(newValue) {
        this.setState({
            editorText: newValue
        });
    },
    commitSourceEdits: function() {
        let node = this.state.nodes[this.state.selectedNodeID];
        node.setValue(this.state.editorText);
        this.forceUpdate();
    },
    serializeNodeGraph: function() {
        console.log(JSON.stringify({
            'nodes': this.state.nodes,
            'bindings': this.state.bindings,
            'workspace': {}
        }, null, '  '));
    },
    render: function() {
        return (
            <div>
                <ButtonToolbar>
                    <DropdownButton title="Add Node" onSelect={this.handleAddNode}>
                        {Object.keys(NodeConstructors).map(key => {
                            return <MenuItem key={key} eventKey={key}>{key}</MenuItem>
                        })}
                    </DropdownButton>
                    <Button onClick={this.handleRemoveNode}
                            disabled={!this.state.selectedNodeID}>
                        Remove
                    </Button>
                    <Button onClick={this.commitSourceEdits}
                            disabled={!this.state.selectedNodeID}>
                        Commit Source Edits
                    </Button>
                    <Button onClick={this.serializeNodeGraph}>
                        Save
                    </Button>
                </ButtonToolbar>
                <div className='gt-workspace'>
                    <Workspace nodes={this.state.nodes}
                               bindings={this.state.bindings}
                               selectedNode={this.state.nodes[this.state.selectedNodeID]}
                               onNodeSelected={this.handleNodeSelected}
                               onBackgroundSelected={this.handleBackgroundSelected}
                               onPortsConnected={this.handlePortsConnected} />
                </div>
                <img className='gt-viewer'
                     alt='Render Viewer'
                     src={this.state.viewerImageData} />
                <div className='gt-shader-editor'>
                    <AceEditor mode='glsl'
                               theme='solarized_dark'
                               name='code-editor' 
                               width='100%'
                               height='100%' 
                               value={this.state.editorText}
                               onChange={this.handleEditorChanged} />
                </div>
            </div>
        );
    }
});

module.exports = App;