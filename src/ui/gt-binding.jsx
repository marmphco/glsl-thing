var React = require('React');
var NodeViewModel = require('./gt-node-view-model.js');

var Binding = React.createClass({
    propTypes: {
        input: React.PropTypes.instanceOf(NodeViewModel),
        output: React.PropTypes.instanceOf(NodeViewModel),
        inputPortName: React.PropTypes.String,
        outputPortName: React.PropTypes.String,
    },
    render: function() {

        var input = this.props.input;
        var output = this.props.output;

        var inputPortPosition = input.inputPortPosition(this.props.inputPortName);
        var outputPortPosition = output.outputPortPosition(this.props.outputPortName);

        var path = 'M' + (input.offset.x + inputPortPosition.x) +
            ' ' + (input.offset.y + inputPortPosition.y) +
            'L' + (output.offset.x + outputPortPosition.x) +
            ' ' + (output.offset.y + outputPortPosition.y);

        return (
            <path stroke='black' d={path} />
        );
    }
});

module.exports = Binding;