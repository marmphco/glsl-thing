var React = require("React");

var makeTranslation = state => {
   return 'translate(' + state.x + ',' + state.y + ')'
};

var Node = React.createClass({
   propTypes: {
      node: React.PropTypes.object,
   },
   getInitialState: () => {
      return {
         dragging: false,
         mouseOffsetX: 0,
         mouseOffsetY: 0,
         x: 0,
         y: 0
      }
   },
   handleMouseDown: function(event) {
      this.setState({
         dragging: true,
         mouseOffsetX: event.clientX - this.state.x,
         mouseOffsetY: event.clientY - this.state.y
      })
   },
   handleMouseUp: function(event) {
      this.setState({
         dragging: false
      })
   },
   handleMouseMove: function(event) {
      if (this.state.dragging) {
         this.setState({
            x: event.clientX - this.state.mouseOffsetX,
            y: event.clientY - this.state.mouseOffsetY
         })
      }
   },
   componentDidUpdate: function(prevProps, prevState) {
      if (this.state.dragging && !prevState.dragging) {
         document.addEventListener('mousemove', this.handleMouseMove);
      }
      else if (!this.state.dragging && prevState.dragging) {
         document.removeEventListener('mousemove', this.handleMouseMove);
      }
   },
   render: function() {
      var self = this;
      return (
         <g transform={makeTranslation(this.state)}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}>
            <rect x='0' y='0' width={140} height={140} fill="#dddddd"></rect>
            {this.props.node.inputPortNames().map(function(portName, index) {
               return (
                  <text key={portName + index.toString()} x='0' y={index * 20 + 20} text-anchor="start">
                     {portName}
                  </text>
               );
            })}

            {this.props.node.outputPortNames().map(function(portName, index) {
               return (
                  <text key={portName + index.toString()} x='140' y={index * 20 + 20} text-anchor="end">
                     {portName}
                  </text>
               );
            })}

            {this.props.children}
         </g>

      );
   }
});

module.exports = Node;