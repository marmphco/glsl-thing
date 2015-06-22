var React = require("React");

var Node = React.createClass({
   propTypes: {
      node: React.PropTypes.object
   },
   render: function() {
      var self = this;
      return (
        <div>
         <p><strong>This</strong> is <em>{this.props.derp}</em></p>
         <strong>Input Ports:</strong>
         <ul>
            {this.props.node.inputPortNames().map(function(portName) {
               return <li>{portName}: {self.props.node.inputPort(portName).value().toString()}</li>;
            })}
         </ul>
         <strong>Output Ports:</strong>
         <ul>
            {this.props.node.outputPortNames().map(function(portName) {
               return <li>{portName}: {self.props.node.outputPort(portName).value().toString()}</li>;
            })}
         </ul>
         {this.props.children}
         </div>
      );
   }
});

module.exports = Node;