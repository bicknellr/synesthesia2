module.declare("Nodes/MainOutput", [
  "Graph",
  "IOInterfaces/Audio"
], function () {

  var Graph = module.require("Graph");

  var Audio = module.require("IOInterfaces/Audio");

  var MainOutput = (function () {
    function MainOutput (params) {
      Graph.Node.apply(this);

      this.context = params.audioContext;

      this.api_node = this.context.destination;

      this.inputs = {
        "audio": new Audio({
          apiNode: this.api_node,
          context: this.context
        })
      };

      this.outputs = {};
    }

    MainOutput.prototype = Object.create(Graph.Node.prototype);

    return MainOutput;
  })();

  return MainOutput;

});
