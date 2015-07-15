/*
    value type for data needed to render a node view.
*/

var Node = require('../lib/gt-node.js');
var Vector2 = require('./gt-vector2.js');

class NodeViewModel {
    constructor(node: Node) {
        this.offset = new Vector2(Math.random() * 400, Math.random() * 400);
        this.size = new Vector2(140, 140);

        this.inputPortPosition = function(portName) {
            return new Vector2(
                0,
                node.inputPortNames().indexOf(portName) * 20 + 20
            );
        }

        this.outputPortPosition = function(portName) {
            return new Vector2(
                this.size.x,
                node.outputPortNames().indexOf(portName) * 20 + 20
            );
        }
    }    
}

module.exports = NodeViewModel;