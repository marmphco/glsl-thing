var GLSLThing = require("./lib/glsl-thing.js");
var React = require("React");
var Node = require("./ui/gt-node.jsx")
var GLSLNode = require("./ui/gt-glslnode.jsx")

window.onload = function() {

   // setup context
   var canvas = document.getElementById("canvas");
   var context = new GLSLThing.Context(canvas);
   var gl = context.gl;

   // get shader source
   var vertexSource = document.getElementById("test-vertex-shader").firstChild.textContent;
   var fragmentSource = document.getElementById("test-fragment-shader").firstChild.textContent;

   // create shader source nodes
   var vshSourceNode = new GLSLThing.ValueNode(GLSLThing.Port.PortType.String);
   var fshSourceNode = new GLSLThing.ValueNode(GLSLThing.Port.PortType.String);
   // set the shader node inputs
   vshSourceNode.setValue(vertexSource);
   fshSourceNode.setValue(fragmentSource);

   // create shader nodes
   var vshNode = new GLSLThing.ShaderNode(gl, gl.VERTEX_SHADER);
   var fshNode = new GLSLThing.ShaderNode(gl, gl.FRAGMENT_SHADER);
   // bind shader nodes to source nodes
   vshNode.inputPort("source").bindTo(vshSourceNode.outputPort("value"));
   fshNode.inputPort("source").bindTo(fshSourceNode.outputPort("value"));

   // create program node
   var programNode = new GLSLThing.ProgramNode(gl);
   // bind shader nodes to inputs of program node
   programNode.inputPort("vertexShader").bindTo(vshNode.outputPort("shader"));
   programNode.inputPort("fragmentShader").bindTo(fshNode.outputPort("shader"));

   // create mesh for a square
   var vertices = new Float32Array([
      0.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      1.0, 1.0, 0.0
   ]);
   var indices = new Uint16Array([0, 1, 2, 3]);
   // create mesh node with square mesh
   var meshNode = new GLSLThing.MeshNode(gl, vertices, indices, gl.TRIANGLE_STRIP);

   // create render node
   var renderNode = new GLSLThing.RenderNode(gl);
   // bind render node inputs to mesh and program
   renderNode.inputPort("mesh").bindTo(meshNode.outputPort("mesh"));
   renderNode.inputPort("program").bindTo(programNode.outputPort("program"));

   React.render(
      <div>
         <Node node={vshSourceNode} derp="herp" />
         <GLSLNode node={fshSourceNode} derp="herp" updateText={function(newText) {
            fshSourceNode.setValue(newText);
         }} />
      </div>,
         document.getElementById("react-thing")
   )

   setTimeout(function() {
      console.log("IMAGE LOADED");
      var imageNode = new GLSLThing.ImageNode(gl);
      renderNode.inputPort("texture0").bindTo(imageNode.outputPort("texture"));
      imageNode.setImageData(document.getElementById("pusheen"));
      testImage = imageNode.outputPort("texture").value();

      var testNode = new GLSLThing.ValueNode(gl.FLOAT);
      renderNode.inputPort("test").bindTo(testNode.outputPort("value"));
      testNode.setValue(0.5);

   }, 0);
}
