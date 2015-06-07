var React = require("React");
var Node = require("./gt-node.jsx");

var GLSLNode = React.createClass({
   propTypes: {
      node: React.PropTypes.object,
      updateText: React.PropTypes.func
   },
   render: function() {
      var self = this;
      return (
         <Node node={this.props.node} derp="fdsafsd">
            <textarea type="text" onChange={this.textChanged}>
               {this.props.node.outputPort("value").value()}
            </textarea>
         </Node>
      );
   },
   textChanged: function(event) {
      console.log(event);
      this.props.updateText(event.target.value);
   }
});

module.exports = GLSLNode;