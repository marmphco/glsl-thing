var React = require('react');

var makeTranslation = state => {
   return 'translate(' + state.x + ',' + state.y + ')'
};

var Node = React.createClass({
   propTypes: {
      node: React.PropTypes.object,
      viewData: React.PropTypes.object,
      id: React.PropTypes.number,
      onMouseDown: React.PropTypes.func,
      onMouseUp: React.PropTypes.func,
   },
   getInitialState: () => {
      return {}
   },
   handleMouseDown: function(event) {
      this.props.onMouseDown(event, this.props.id);
   },
   handleMouseUp: function(event) {
      this.props.onMouseUp(event, this.props.id);
   },
   render: function() {
      return (
         <g transform={makeTranslation(this.props.viewData)}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}>
            <rect x='0' y='0' width={this.props.viewData.width} height={this.props.viewData.height} fill='#dddddd'></rect>
            {this.props.node.inputPortNames().map((portName, index) => {
               return (
                  <text key={index} x='0' y={index * 20 + 20} textAnchor='start'>
                     {portName}
                  </text>
               );
            })}

            {this.props.node.outputPortNames().map((portName, index) => {
               return (
                  <text key={index} x={this.props.viewData.width} y={index * 20 + 20} textAnchor='end'>
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