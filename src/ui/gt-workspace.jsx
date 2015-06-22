var React = require('React');
var Node = require('./gt-node.jsx');

var Workspace = React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        nodes: React.PropTypes.array
    },
    render: function() {
        return (
            <svg width={this.props.width} height={this.props.height} xmlns="http://www.w3.org/2000/svg">
                {this.props.nodes.map(function(node) {
                    return <Node node={node} derp="herp" />
                })}
            </svg>
        );
    }
});

module.exports = Workspace;