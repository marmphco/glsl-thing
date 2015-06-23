var React = require('React');
var Node = require('./gt-node.jsx');
var TextNode = require('./gt-textnode.jsx');
var PortTypes = require('../lib/gt-port.js').PortType;
var NodeTypes = require('../lib/gt-node-types.js');

var Workspace = React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        nodes: React.PropTypes.array,
        bindings: React.PropTypes.array
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
            return {
                x: Math.random() * 400,
                y: Math.random() * 400,
                width: 140,
                height: 140
            }
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
        this.setState({
            dragging: true,
            draggingID: id,
            mouseOffsetX: event.clientX - this.state.viewData[id].x,
            mouseOffsetY: event.clientY - this.state.viewData[id].y
        });
        event.stopPropagation();
    },
    handleNodeMouseUp: function(event, id) {
        this.setState({dragging: false});
        event.stopPropagation();
    },
    handleMouseMove: function(event) {
        if (this.state.dragging) {
            var viewData = this.state.viewData;
            viewData[this.state.draggingID].x = event.clientX - this.state.mouseOffsetX;
            viewData[this.state.draggingID].y = event.clientY - this.state.mouseOffsetY;
            this.setState({
                viewData: viewData
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
        return 'M' + inputViewData.x +
               ' ' + inputViewData.y +
               'L' + (outputViewData.x + outputViewData.width) +
               ' ' + (outputViewData.y);
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
                        if (node.type() == (PortTypes.String + NodeTypes.ValueNode)) {
                            return <TextNode key={index}
                                             node={node}
                                             id={index}
                                             viewData={this.state.viewData[index]} 
                                             onMouseDown={this.handleNodeMouseDown}
                                             onMouseUp={this.handleNodeMouseUp} 
                                             updateText={(newText) => {node.setValue(newText);}}/>
                        }
                        else {
                            return <Node key={index}
                                         node={node}
                                         id={index}
                                         viewData={this.state.viewData[index]}
                                         onMouseDown={this.handleNodeMouseDown}
                                         onMouseUp={this.handleNodeMouseUp} />
                        }
                    })}
                    
                    {this.props.bindings.map((binding, index) => {
                        return <path stroke='black' d={this.getBindingPath(binding)} />
                    })}
                </g>
            </svg>
        );
    }
});

module.exports = Workspace;
