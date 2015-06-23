var React = require("React");
var Node = require("./gt-node.jsx");

var TextNode = React.createClass({
   propTypes: {
      node: React.PropTypes.object,
      id: React.PropTypes.number,
      onMouseDown: React.PropTypes.func,
      onMouseUp: React.PropTypes.func,
      updateText: React.PropTypes.func
   },
   render: function() {
      var self = this;
      return (
         <Node node={this.props.node}
               id={this.props.id}
               viewData={this.props.viewData}
               onMouseDown={this.props.onMouseDown}
               onMouseUp={this.props.onMouseUp}>
            <foreignObject width='100'
                           height='100'
                           requiredExtensions='http://www.w3.org/1999/xhtml'>
               <body xmlns="http://www.w3.org/1999/xhtml">
                  <textarea type='text'
                            onChange={this.textChanged}
                            defaultValue={this.props.node.outputPort("value").value()}>
                  </textarea>
               </body>
            </foreignObject>
         </Node>
      );
   },
   textChanged: function(event) {
      this.props.updateText(event.target.value);
   }
});

module.exports = TextNode;