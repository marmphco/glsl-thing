var React = require('React/addons');
var AceEditor = require('react-ace');
var Workspace = require('../ui/gt-workspace.jsx');
var GLSLThing = require('../lib/glsl-thing.js');
var NodeTypes = require('../lib/gt-node-types.js');
var PortTypes = require('../lib/gt-port.js').PortType;

require('brace/mode/glsl');
require('brace/theme/solarized_dark');

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
        return nodes.length - 1;
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
                             onNodeDeselected={this.handleNodeDeselected}/>
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
            </div>
        );
    }
});

module.exports = App;