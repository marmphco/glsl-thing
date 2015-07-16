const NodeTypes = require('../lib/gt-node-types.js');
const Node = require('./gt-node.jsx');

module.exports = {
    [NodeTypes.ImageNode]: Node,
    [NodeTypes.MeshNode]: Node,
    [NodeTypes.ProgramNode]: Node,
    [NodeTypes.RenderNode]: Node,
    [NodeTypes.ShaderNode]: Node,
    [NodeTypes.ValueNode]: Node,
    [NodeTypes.ImageOutputNode]: Node,
    [NodeTypes.Node]: Node,
};
