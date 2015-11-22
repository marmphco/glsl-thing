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
        selectedNode: React.PropTypes.object,
        onNodeSelected: React.PropTypes.func,
        onBackgroundSelected: React.PropTypes.func,
        onPortsConnected: React.PropTypes.func
    },
    getInitialState: () => {
        return {
            draggingNode: false,
            draggingPort: false,
            panning: false,
            globalOffset: new Vector2(),
            dragOffset: new Vector2(),
            dragOrigin: new Vector2(),
            draggedNodeID: 0,
            draggedPortName: '',
            draggedPortPolarity: 'input',
            viewData: {}
        };
    },
    componentWillReceiveProps: function(nextProps) {
        let newViewData = {};
        for (let key in nextProps.nodes) {
            if (key in this.state.viewData) {
                newViewData[key] = this.state.viewData[key];
            }
            else {
                newViewData[key] = new NodeViewModel(nextProps.nodes[key]);
            }
        }

        this.setState({
            viewData: newViewData
        });
    },
    handleMouseDown: function(event, id) {
        this.props.onBackgroundSelected();

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
        this.props.onNodeSelected(id);

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
        this.setState({draggingNode: false});
        event.stopPropagation();
    },
    handleInputPortMouseDown: function(event, id, portName) {
        let elementOffset = React.findDOMNode(this.refs.svg).getBoundingClientRect();
        this.setState({
            draggingPort: true,
            draggedNodeID: id,
            draggedPortName: portName,
            draggedPortPolarity: 'input',
            dragOrigin: new Vector2(
                event.clientX - elementOffset.left,
                event.clientY - elementOffset.top),
            dragOffset: new Vector2(
                event.clientX - elementOffset.left,
                event.clientY - elementOffset.top),
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
        let elementOffset = React.findDOMNode(this.refs.svg).getBoundingClientRect();
        this.setState({
            draggingPort: true,
            draggedNodeID: id,
            draggedPortName: portName,
            draggedPortPolarity: 'output',
            dragOrigin: new Vector2(
                event.clientX - elementOffset.left,
                event.clientY - elementOffset.top),
            dragOffset: new Vector2(
                event.clientX - elementOffset.left,
                event.clientY - elementOffset.top),
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
            let elementOffset = React.findDOMNode(this.refs.svg).getBoundingClientRect();
            this.setState({
                dragOffset: new Vector2(
                    event.clientX - elementOffset.left,
                    event.clientY - elementOffset.top)
            })
        }
    },
    render: function() {
        let path = '';
        if (this.state.draggingPort) {
            const sourceViewData = this.state.viewData[this.state.draggedNodeID];

            const sourcePortPosition = this.state.draggedPortPolarity == 'input' ?
                sourceViewData.inputPortPosition(this.state.draggedPortName)
                : sourceViewData.outputPortPosition(this.state.draggedPortName);

            path = 'M' + (sourcePortPosition.x + sourceViewData.offset.x) +
                ' ' + (sourcePortPosition.y + sourceViewData.offset.y) +
                'L' + (this.state.dragOffset.x - this.state.globalOffset.x) +
                ' ' + (this.state.dragOffset.y - this.state.globalOffset.y);
        }

        return (
            <svg ref="svg"
                 style={{'width': '100%', 'height': '100%'}}
                 xmlns='http://www.w3.org/2000/svg'
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}
                 onMouseMove={this.handleMouseMove}>

                <g transform={'translate(' + this.state.globalOffset.x + ',' + this.state.globalOffset.y + ')'}>                    
                    
                    <path d={path} className='gt-binding' />

                    {this.props.bindings.map((binding, index) => {
                        return <Binding key={index}
                                        input={this.state.viewData[binding.input.id]}
                                        output={this.state.viewData[binding.output.id]}
                                        inputPortName={binding.input.port}
                                        outputPortName={binding.output.port} />
                    })}             

                    {Object.keys(this.props.nodes).map((key) => {
                        const node = this.props.nodes[key];
                        //const NodeComponent = nodeComponents[node.type()];
                        return <Node key={key}
                                     node={node}
                                     id={key}
                                     viewData={this.state.viewData[key]}
                                     highlighted={this.props.selectedNode == node}
                                     onMouseDown={this.handleNodeMouseDown}
                                     onMouseUp={this.handleNodeMouseUp}
                                     onInputPortMouseDown={this.handleInputPortMouseDown}
                                     onInputPortMouseUp={this.handleInputPortMouseUp}
                                     onOutputPortMouseDown={this.handleOutputPortMouseDown}
                                     onOutputPortMouseUp={this.handleOutputPortMouseUp}>
                                </Node>
                    })}
                </g>
            </svg>
        );
    }
});

module.exports = Workspace;
