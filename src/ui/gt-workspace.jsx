var React = require('react');
var update = require('react/lib/update');
var Node = require('./gt-node.jsx');
var PortTypes = require('../lib/gt-port.js').PortType;
var NodeTypes = require('../lib/gt-node-types.js');
var NodeViewModel = require('./gt-node-view-model.js');
var Binding = require('./gt-binding.jsx')

var Workspace = React.createClass({
    propTypes: {
        nodes: React.PropTypes.array,
        bindings: React.PropTypes.array,
        onNodeSelected: React.PropTypes.func,
        onNodeDeselected: React.PropTypes.func
    },
    getInitialState: () => {
        return {
            dragging: false,
            draggingID: 0,
            mouseOffsetX: 0,
            mouseOffsetY: 0,
            panning: false,
            globalOffsetX: 0,
            globalOffsetY: 0,
            viewData: []
        };
    },
    componentWillMount: function() {
        this.state.viewData = this.props.nodes.map(node => {
            return new NodeViewModel(node);
        });
    },
    componentWillReceiveProps: function(nextProps) {
        // props.nodes should be an Object to make this easier
        // nodes should be assigned unique keys
        if (nextProps.nodes.length > this.state.viewData.length)
        this.setState({
            viewData: this.state.viewData.concat([
                new NodeViewModel(nextProps.nodes[nextProps.nodes.length - 1])
            ])
        });
    },
    handleMouseDown: function(event, id) {
        this.setState({
            panning: true,
            mouseOffsetX: event.clientX - this.state.globalOffsetX,
            mouseOffsetY: event.clientY - this.state.globalOffsetY
        });
    },
    handleMouseUp: function(event, id) {
        this.setState({panning: false})
    },
    handleNodeMouseDown: function(event, id) {
        this.props.onNodeSelected(this.props.nodes[id]);

        var nodeViewPosition = this.state.viewData[id].offset;
        this.setState({
            dragging: true,
            draggingID: id,
            mouseOffsetX: event.clientX - nodeViewPosition.x,
            mouseOffsetY: event.clientY - nodeViewPosition.y
        });
        event.stopPropagation();
    },
    handleNodeMouseUp: function(event, id) {
        this.props.onNodeSelected(this.props.nodes[id]);

        this.setState({dragging: false});
        event.stopPropagation();
    },
    handleMouseMove: function(event) {
        if (this.state.dragging) {
            const viewData = this.state.viewData;
            const newViewData = update(this.state.viewData, {
                [this.state.draggingID]: {
                    offset: {
                        x: {$set: event.clientX - this.state.mouseOffsetX},
                        y: {$set: event.clientY - this.state.mouseOffsetY}
                    }
                }
            });

            this.setState({
                viewData: newViewData
            })
        }
        else if (this.state.panning) {
            this.setState({
                globalOffsetX: event.clientX - this.state.mouseOffsetX,
                globalOffsetY: event.clientY - this.state.mouseOffsetY
            })
        }
    },
    render: function() {
        return (
            <svg style={{'width': '100%', 'height': '100%'}}
                 xmlns='http://www.w3.org/2000/svg'
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}
                 onMouseMove={this.handleMouseMove}>

                <g transform={'translate(' + this.state.globalOffsetX + ',' + this.state.globalOffsetY + ')'}>                    
                    {this.props.nodes.map((node, index) => {
                            return <Node key={index}
                                         node={node}
                                         id={index}
                                         viewData={this.state.viewData[index]}
                                         onMouseDown={this.handleNodeMouseDown}
                                         onMouseUp={this.handleNodeMouseUp} />
                    })}
                    
                    {this.props.bindings.map((binding, index) => {
                        return <Binding input={this.state.viewData[binding.input.id]}
                                        output={this.state.viewData[binding.output.id]}
                                        inputPortName={binding.input.port}
                                        outputPortNam={binding.output.port} />
                    })}
                </g>
            </svg>
        );
    }
});

module.exports = Workspace;
