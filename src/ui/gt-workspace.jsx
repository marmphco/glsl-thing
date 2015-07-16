var React = require('react');
var update = require('react/lib/update');
var Node = require('./gt-node.jsx');
var PortTypes = require('../lib/gt-port.js').PortType;
var NodeTypes = require('../lib/gt-node-types.js');
var NodeViewModel = require('./gt-node-view-model.js');
var Binding = require('./gt-binding.jsx');
var Vector2 = require('./gt-vector2.js');
var nodeComponents = require('./gt-node-components.js');

var Workspace = React.createClass({
    propTypes: {
        nodes: React.PropTypes.object,
        bindings: React.PropTypes.array,
        onNodeSelected: React.PropTypes.func,
        onNodeDeselected: React.PropTypes.func,
        onPortsConnected: React.PropTypes.func
    },
    getInitialState: () => {
        return {
            draggingNode: false,
            draggingPort: false,
            panning: false,
            globalOffset: new Vector2(),
            dragOffset: new Vector2(),
            mouseOffset: new Vector2(),
            draggedNodeID: 0,
            draggedPortName: '',
            draggedPortPolarity: 'input',
            viewData: {}
        };
    },
    componentWillReceiveProps: function(nextProps) {
        for (let key in nextProps.nodes) {
            if (!(key in this.state.viewData)) {
                this.setState({
                    viewData: update(this.state.viewData, {
                        [key]: {$set: new NodeViewModel(nextProps.nodes[key])}
                    })
                });
            }
        }
    },
    handleMouseDown: function(event, id) {
        const offsetX = event.clientX - this.state.globalOffset.x;
        const offsetY = event.clientY - this.state.globalOffset.y;
        this.setState({
            panning: true,
            dragOffset: new Vector2(offsetX, offsetY)
        });
    },
    handleMouseUp: function(event, id) {
        this.setState({
            panning: false,
            draggingNode: false,
            draggingPort: false,
        });
    },
    handleNodeMouseDown: function(event, id) {
        this.props.onNodeSelected(this.props.nodes[id]);

        var nodeViewPosition = this.state.viewData[id].offset;
        var offsetX = event.clientX - nodeViewPosition.x;
        var offsetY = event.clientY - nodeViewPosition.y;
        this.setState({
            draggingNode: true,
            draggedNodeID: id,
            dragOffset: new Vector2(offsetX, offsetY)
        });
        event.stopPropagation();
    },
    handleNodeMouseUp: function(event, id) {
        this.props.onNodeSelected(this.props.nodes[id]);
        this.setState({draggingNode: false});
        event.stopPropagation();
    },
    handleInputPortMouseDown: function(event, id, portName) {
        this.setState({
            draggingPort: true,
            draggedNodeID: id,
            draggedPortName: portName,
            draggedPortPolarity: 'input'
        });
    },
    handleInputPortMouseUp: function(event, id, portName) {
        if (this.state.draggingPort && this.state.draggedPortPolarity == 'output') {
            this.props.onPortsConnected(id, portName, this.state.draggedNodeID, this.state.draggedPortName);
        }
        this.setState({
            draggingPort: false,
            draggingNode: false,
            panning: false
        });
    },
    handleOutputPortMouseDown: function(event, id, portName) {
        this.setState({
            draggingPort: true,
            draggedNodeID: id,
            draggedPortName: portName,
            draggedPortPolarity: 'output'
        });
    },
    handleOutputPortMouseUp: function(event, id, portName) {
        if (this.state.draggingPort && this.state.draggedPortPolarity == 'input') {
            this.props.onPortsConnected(this.state.draggedNodeID, this.state.draggedPortName, id, portName);
        }
        this.setState({
            draggingPort: false,
            draggingNode: false,
            panning: false
        });
    },
    handleMouseMove: function(event) {
        if (this.state.draggingNode) {
            const viewData = this.state.viewData;
            const newViewData = update(this.state.viewData, {
                [this.state.draggedNodeID]: {
                    offset: {
                        x: {$set: event.clientX - this.state.dragOffset.x},
                        y: {$set: event.clientY - this.state.dragOffset.y}
                    }
                }
            });

            this.setState({
                viewData: newViewData
            })
        }
        
        if (this.state.panning) {
            const offsetX = event.clientX - this.state.dragOffset.x;
            const offsetY = event.clientY - this.state.dragOffset.y;
            this.setState({
                globalOffset: new Vector2(offsetX, offsetY)
            })
        }

        if (this.state.draggingPort) {

        }
    },
    render: function() {
        return (
            <svg style={{'width': '100%', 'height': '100%'}}
                 xmlns='http://www.w3.org/2000/svg'
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}
                 onMouseMove={this.handleMouseMove}>

                <g transform={'translate(' + this.state.globalOffset.x + ',' + this.state.globalOffset.y + ')'}>                    
                    {Object.keys(this.props.nodes).map((key) => {
                        const node = this.props.nodes[key];
                        //const NodeComponent = nodeComponents[node.type()];
                        return <Node key={key}
                                     node={node}
                                     id={key}
                                     viewData={this.state.viewData[key]}
                                     onMouseDown={this.handleNodeMouseDown}
                                     onMouseUp={this.handleNodeMouseUp}
                                     onInputPortMouseDown={this.handleInputPortMouseDown}
                                     onInputPortMouseUp={this.handleInputPortMouseUp}
                                     onOutputPortMouseDown={this.handleOutputPortMouseDown}
                                     onOutputPortMouseUp={this.handleOutputPortMouseUp}>
                                </Node>
                    })}
                    
                    {this.props.bindings.map((binding, index) => {
                        return <Binding key={index}
                                        input={this.state.viewData[binding.input.id]}
                                        output={this.state.viewData[binding.output.id]}
                                        inputPortName={binding.input.port}
                                        outputPortName={binding.output.port} />
                    })}
                </g>
            </svg>
        );
    }
});

module.exports = Workspace;
