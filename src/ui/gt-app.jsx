var React = require('react');
var update = require('react/lib/update');
var AceEditor = require('react-ace');
var GLSLThing = require('../lib/glsl-thing.js');
var NodeTypes = require('../lib/gt-node-types.js');
var PortTypes = require('../lib/gt-port.js').PortType;

var Workspace = require('./gt-workspace.jsx');
var NodeConstructors = require('./gt-node-constructors.js');
var Vector2 = require('./gt-vector2.js');

var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Button = require('react-bootstrap').Button;

require('brace/mode/glsl');
require('brace/theme/solarized_dark');

var test = {
  "nodes": {
    "0": {
      "type": "ValueNode",
      "valueType": "String",
      "value": "attribute lowp vec4 aPosition;\nattribute lowp vec4 aColor;\n\nvarying lowp vec4 vColor;\n\nvoid main(void) {\n    vColor = aColor;\n    gl_Position = aPosition;\n}"
    },
    "1": {
      "type": "ValueNode",
      "valueType": "String",
      "value": "varying lowp vec4 vColor;\n\nvoid main(void) {\n    gl_FragColor = vColor;\n}"
    },
    "2": {
      "type": "ShaderNode",
      "shaderType": "VertexShader"
    },
    "3": {
      "type": "ShaderNode",
      "shaderType": "FragmentShader"
    },
    "4": {
      "type": "ProgramNode"
    },
    "5": {
      "type": "RenderNode",
      "attributePorts": [
        {
          "name": "aPosition",
          "type": "Attribute"
        },
        {
          "name": "aColor",
          "type": "Attribute"
        }
      ],
      "uniformPorts": []
    },
    "6": {
      "type": "MeshNode",
      "mesh": {
        "drawMode": 5,
        "elementArrayKey": "indices",
        "arrays": {
          "indices": [
            0,
            1,
            2,
            3
          ],
          "positions": [
            -1,
            -1,
            0,
            1,
            -1,
            0,
            -1,
            1,
            0,
            1,
            1,
            0
          ],
          "colors": [
            1,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            1,
            0.2,
            0.5,
            0.1
          ]
        },
        "attributes": {
          "positions": {
            "key": "positions",
            "dimension": 3,
            "stride": 12,
            "offset": 0
          },
          "colors": {
            "key": "colors",
            "dimension": 3,
            "stride": 12,
            "offset": 0
          }
        }
      }
    }
  },
  "bindings": [
    {
      "input": {
        "id": "2",
        "port": "source"
      },
      "output": {
        "id": "0",
        "port": "value"
      }
    },
    {
      "input": {
        "id": "3",
        "port": "source"
      },
      "output": {
        "id": "1",
        "port": "value"
      }
    },
    {
      "input": {
        "id": "5",
        "port": "program"
      },
      "output": {
        "id": "4",
        "port": "program"
      }
    },
    {
      "input": {
        "id": "4",
        "port": "vertexShader"
      },
      "output": {
        "id": "2",
        "port": "shader"
      }
    },
    {
      "input": {
        "id": "4",
        "port": "fragmentShader"
      },
      "output": {
        "id": "3",
        "port": "shader"
      }
    },
    {
      "input": {
        "id": "5",
        "port": "mesh"
      },
      "output": {
        "id": "6",
        "port": "mesh"
      }
    },
    {
      "input": {
        "id": "5",
        "port": "aPosition"
      },
      "output": {
        "id": "6",
        "port": "attr:positions"
      }
    },
    {
      "input": {
        "id": "5",
        "port": "aColor"
      },
      "output": {
        "id": "6",
        "port": "attr:colors"
      }
    }
  ],
  "workspace": {
    "0": {
      "offset": {
        "x": 18.2541101872921,
        "y": 61.53165062516928
      },
      "size": {
        "x": 200,
        "y": 160
      }
    },
    "1": {
      "offset": {
        "x": 15.948879890143871,
        "y": 271.43772887438536
      },
      "size": {
        "x": 200,
        "y": 160
      }
    },
    "2": {
      "offset": {
        "x": 264.32559541612864,
        "y": 67.50347302854061
      },
      "size": {
        "x": 200,
        "y": 160
      }
    },
    "3": {
      "offset": {
        "x": 265.7197719216347,
        "y": 260.75499637424946
      },
      "size": {
        "x": 200,
        "y": 160
      }
    },
    "4": {
      "offset": {
        "x": 510.64138454571366,
        "y": 274.04291651397943
      },
      "size": {
        "x": 200,
        "y": 160
      }
    },
    "5": {
      "offset": {
        "x": 781.3302920497954,
        "y": 78.0920241959393
      },
      "size": {
        "x": 200,
        "y": 160
      }
    },
    "6": {
      "offset": {
        "x": 507.996053095907,
        "y": 72.25025924667716
      },
      "size": {
        "x": 200,
        "y": 160
      }
    }
  }
};

var App = React.createClass({
    propTypes: {
        glContext: React.PropTypes.instanceOf
    },
    componentWillMount: function() {
        this.layoutData = null;
        this.uid = 0;
    },
    getInitialState: function() {
        return {
            nodes: {},
            bindings: [],
            editorText: '',
            selectedNodeID: null,
            viewerImageData: '',
            // state restoration
            restoredAppState: test
        };
    },
    addNode: function(node, uid) {
        this.setState(function(previousState, currentProps) {
            return {
                nodes: update(previousState.nodes, {
                    [uid]: {$set: node}
                })
            }
        });
    },
    removeNodeWithID: function(id) {
        // remove any bindings concerning this node
        this.state.bindings.forEach((binding) => {
            if (binding.input.id == id || binding.output.id == id) {
                this.removeBinding(binding.input.id, binding.input.port);
            }
        });

        // remove the node
        this.setState(function(previousState, currentProps) {
            delete previousState[id];
            return {
                nodes: previousState,
            }
        });
    },
    addBinding: function(inputNodeID, inputPortName, outputNodeID, outputPortName) {

        this.setState(function(previousState, currentProps) {
            const inputNode = previousState.nodes[inputNodeID];
            const inputPort = inputNode.inputPort(inputPortName);
            const outputNode = previousState.nodes[outputNodeID];
            const outputPort = outputNode.outputPort(outputPortName);

            if (inputPort.bindTo(outputPort)) {
                return {
                    bindings: previousState.bindings.concat([{
                        input: {id: inputNodeID, port: inputPortName},
                        output: {id: outputNodeID, port: outputPortName}
                    }])
                }
            }
            else {
                // if the binding failed, don't change the state
                return {};
            }
        });
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
        this.addNode(NodeConstructors[key](this.props.glContext), this.uid.toString());
        this.uid++;
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
    handleLayoutChanged: function(layoutData) {
        this.layoutData = layoutData;
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
    serializeAppState: function() {
        console.log(JSON.stringify({
            'nodes': this.state.nodes,
            'bindings': this.state.bindings,
            'workspace': this.layoutData
        }, null, '  '));
    },
    restoreAppState: function(appState) {        
        // remove all previous nodes (and consequently bindings)
        Object.keys(this.state.nodes).forEach((id) => {
            this.removeNodeWithID(id);
        });

        // add restored nodes
        Object.keys(appState.nodes).forEach((id) => {
            const nodeInfo = appState.nodes[id];
            switch (nodeInfo['type']) {
                case NodeTypes.ValueNode:
                    var node = new GLSLThing.ValueNode(PortTypes.String);
                    node.setValue(nodeInfo['value']);
                    this.addNode(node, id);
                    break;
                case NodeTypes.ShaderNode:
                    this.addNode(new GLSLThing.ShaderNode(this.props.glContext, nodeInfo['shaderType']), id);
                    break;
                case NodeTypes.ProgramNode:
                    this.addNode(new GLSLThing.ProgramNode(this.props.glContext), id);
                    break;
                case NodeTypes.MeshNode:
                    const meshInfo = nodeInfo['mesh'];
                    this.addNode(new GLSLThing.MeshNode(this.props.glContext, meshInfo['drawMode'], meshInfo['elementArrayKey'], meshInfo['arrays'], meshInfo['attributes']), id);
                    break;
                case NodeTypes.RenderNode:
                    this.addNode(new GLSLThing.RenderNode(this.props.glContext, nodeInfo['attributePorts'], nodeInfo['uniformPorts']), id);
                    break;
                default:
                    console.log('No restoration constructor for ', nodeInfo.type);
                    break;
            }
        })

        // add restored bindings
        appState.bindings.forEach((binding) => {
            this.addBinding(binding.input.id, binding.input.port, binding.output.id, binding.output.port);
        })

        // update uid to be max of all appState id's
        this.uid = Object.keys(appState.nodes).reduce((max, id) => {
            return Math.max(parseFloat(id), max);
        })

        this.state.restoredAppState = appState;
    },
    restoreDefaultAppState: function() {
        this.restoreAppState(test);
    },
    render: function() {

        // temporary hack to restore workspace state
        var overrideWorkspace = null;
        if (this.state.restoredAppState) {
            Object.keys(this.state.restoredAppState.workspace).forEach((key) => {

                const node = this.state.nodes[key];
                const layoutData = test['workspace'][key];

                layoutData.inputPortPosition = function(portName) {
                    return new Vector2(
                        0,
                        node.inputPortNames().indexOf(portName) * 20 + 40
                    );
                };

                layoutData.outputPortPosition = function(portName) {
                    return new Vector2(
                        this.size.x,
                        node.outputPortNames().indexOf(portName) * 20 + 40
                    );
                };
            });
            overrideWorkspace = this.state.restoredAppState.workspace;
            this.state.restoredAppState = null;
        }
        //

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
                    <Button onClick={this.serializeAppState}>
                        Save
                    </Button>
                    <Button onClick={this.restoreDefaultAppState}>
                        Restore Default
                    </Button>
                </ButtonToolbar>
                <div className='gt-workspace'>
                    <Workspace nodes={this.state.nodes}
                               bindings={this.state.bindings}
                               selectedNode={this.state.nodes[this.state.selectedNodeID]}
                               overrideLayout={overrideWorkspace}
                               onNodeSelected={this.handleNodeSelected}
                               onBackgroundSelected={this.handleBackgroundSelected}
                               onPortsConnected={this.handlePortsConnected}
                               onLayoutChanged={this.handleLayoutChanged} />
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