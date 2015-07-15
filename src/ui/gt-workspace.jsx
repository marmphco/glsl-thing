var React = require('React');
var Node = require('./gt-node.jsx');
var PortTypes = require('../lib/gt-port.js').PortType;
var NodeTypes = require('../lib/gt-node-types.js');
var NodeViewModel = require('./gt-node-view-model.js');
//var Binding = require('gt-binding.js')

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
            return new NodeViewModel(node);/*{
                x: Math.random() * 400,
                y: Math.random() * 400,
                width: 140,
                height: 140,
                inputPortPosition: function(name) {
                    return node.inputPortNames().indexOf(name) * 20 + 20;
                },
                outputPortPosition: function(name) {
                    return node.outputPortNames().indexOf(name) * 20 + 20;
                }
            }*/
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
            var nodeViewData = this.state.viewData[this.state.draggingID];
            nodeViewData.offset.x = event.clientX - this.state.mouseOffsetX;
            nodeViewData.offset.y = event.clientY - this.state.mouseOffsetY;
            this.setState({
                viewData: this.state.viewData
            })
        }
        else if (this.state.panning) {
            this.setState({
                globalOffsetX: event.clientX - this.state.mouseOffsetX,
                globalOffsetY: event.clientY - this.state.mouseOffsetY
            })
        }
    },
    getBindingPath: function(binding) {
        var inputViewData = this.state.viewData[binding.input.id];
        var outputViewData = this.state.viewData[binding.output.id];

        var inputPortPosition = inputViewData.inputPortPosition(binding.input.port);
        var outputPortPosition = outputViewData.outputPortPosition(binding.output.port);

        return 'M' + (inputViewData.offset.x + inputPortPosition.x) +
               ' ' + (inputViewData.offset.y + inputPortPosition.y) +
               'L' + (outputViewData.offset.x + outputPortPosition.x) +
               ' ' + (outputViewData.offset.y + outputPortPosition.y);
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
                        /*return <Binding source={this.state.node[binding.input.id]}
                                        dest={this.state.viewData[binding.input.id]}*/
                        return <path stroke='black' d={this.getBindingPath(binding)} />
                    })}
                </g>
            </svg>
        );
    }
});

module.exports = Workspace;
