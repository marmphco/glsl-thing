var React = require('react');
var Vector2 = require('./gt-vector2.js');
var NodeModel = require('../lib/gt-node.js')
var NodeViewModel = require('./gt-node-view-model.js');

var Node = React.createClass({
   propTypes: {
      node: React.PropTypes.instanceOf(NodeModel),
      viewData: React.PropTypes.instanceOf(NodeViewModel),
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
   makeTranslation: offset => {
      return 'translate(' + offset.x + ',' + offset.y + ')'
   },
   render: function() {
      return (
         <g transform={this.makeTranslation(this.props.viewData.offset)}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}>
            
            <rect x='0'
                  y='0'
                  width={this.props.viewData.size.x}
                  height={this.props.viewData.size.y}
                  fill='#dddddd'>
            </rect>

            {this.props.node.inputPortNames().map((portName, index) => {

               const portPosition = this.props.viewData.inputPortPosition(portName);
               return (
                  <g>
                     <circle cx={portPosition.x} cy={portPosition.y} r="4">
                     </circle>
                     <text key={index}
                           x={portPosition.x + 8}
                           y={portPosition.y}
                           textAnchor='start'>
                        {portName}
                     </text>
                  </g>
               );
            })}

            {this.props.node.outputPortNames().map((portName, index) => {

               const portPosition = this.props.viewData.outputPortPosition(portName);
               return (
                  <g>
                     <circle cx={portPosition.x} cy={portPosition.y} r="4">
                     </circle>
                     <text key={index}
                           x={portPosition.x - 8}
                           y={portPosition.y}
                           textAnchor='end'>
                        {portName}
                     </text>
                  </g>
               );
            })}

            {this.props.children}
         </g>

      );
   }
});

module.exports = Node;