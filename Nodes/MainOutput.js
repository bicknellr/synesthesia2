module.declare("Nodes/MainOutput", [
  "Graph",
  "Synesthesia", 
  "IOInterfaces/Audio"
], function () {

  var Graph = module.require("Graph");
  var Synesthesia = module.require("Synesthesia");

  Synesthesia.NodeLibrary["MainOutput"] = (function () {
    function MainOutput (params) {
      Graph.Node.apply(this);

      this.context = params.audioContext;

      this.api_node = this.context.destination;

      this.inputs = {
        "audio": new Synesthesia.IOInterfaces.Audio({
          apiNode: this.api_node,
          context: this.context
        })
      };

      this.outputs = {};
    }

    MainOutput.prototype = Object.create(Graph.Node.prototype);

    return MainOutput;
  })();

});
