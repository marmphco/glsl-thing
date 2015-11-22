var React = require('react');
var Vector2 = require('./gt-vector2.js');
var NodeModel = require('../lib/gt-node.js')
var NodeViewModel = require('./gt-node-view-model.js');

var Node = React.createClass({
   propTypes: {
      node: React.PropTypes.instanceOf(NodeModel),
      viewData: React.PropTypes.instanceOf(NodeViewModel),
      highlighted: React.PropTypes.bool,
      id: React.PropTypes.string,
      onMouseDown: React.PropTypes.func,
      onMouseUp: React.PropTypes.func,
      onInputPortMouseDown: React.PropTypes.func,
      onInputPortMouseUp: React.PropTypes.func,
      onOutputPortMouseDown: React.PropTypes.func,
      onOutputPortMouseUp: React.PropTypes.func,
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
   handleInputPortMouseDown: function(portName, event) {
      this.props.onInputPortMouseDown(event, this.props.id, portName)
      event.stopPropagation();
   },
   handleInputPortMouseUp: function(portName, event) {
      this.props.onInputPortMouseUp(event, this.props.id, portName)
   },
   handleOutputPortMouseDown: function(portName, event) {
      this.props.onOutputPortMouseDown(event, this.props.id, portName)
      event.stopPropagation();
   },
   handleOutputPortMouseUp: function(portName, event) {
      this.props.onOutputPortMouseUp(event, this.props.id, portName)
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
                  rx='4'
                  ry='4'
                  width={this.props.viewData.size.x}
                  height={this.props.viewData.size.y}
                  className={this.props.highlighted ? 'gt-node-base gt-node-highlighted' : 'gt-node-base'} />
            <text x={this.props.viewData.size.x / 2}
                  y='20'
                  textAnchor='middle'
                  className='gt-port-label'>
               {this.props.node.type()}
            </text>

            {this.props.node.inputPortNames().map((portName, index) => {

               const portPosition = this.props.viewData.inputPortPosition(portName);
               return (
                  <g key={index}>
                     <circle cx={portPosition.x}
                             cy={portPosition.y}
                             r="6"
                             onMouseDown={this.handleInputPortMouseDown.bind(this, portName)}
                             onMouseUp={this.handleInputPortMouseUp.bind(this, portName)}
                             className='gt-port' />
                     <text x={portPosition.x + 8}
                           y={portPosition.y}
                           textAnchor='start'
                           className='gt-port-label' >
                        {portName}
                     </text>
                  </g>
               );
            })}

            {this.props.node.outputPortNames().map((portName, index) => {

               const portPosition = this.props.viewData.outputPortPosition(portName);
               return (
                  <g key={index}>
                     <circle cx={portPosition.x}
                             cy={portPosition.y}
                             r="6"
                             onMouseDown={this.handleOutputPortMouseDown.bind(this, portName)}
                             onMouseUp={this.handleOutputPortMouseUp.bind(this, portName)}
                             className='gt-port' />
                     <text x={portPosition.x - 8}
                           y={portPosition.y}
                           textAnchor='end'
                           className='gt-port-label' >
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