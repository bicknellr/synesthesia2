module.declare("Nodes/Gain", [
  "Graph",
  "Synesthesia",
  "IOInterfaces/Audio",
  "IOInterfaces/AudioParam"
], function () {

  var Graph = module.require("Graph");
  var Synesthesia = module.require("Synesthesia");

  Synesthesia.NodeLibrary["Gain"] = (function () {
    function Gain (params) {
      Graph.Node.apply(this);

      this.context = params.audioContext;

      this.api_node = this.context.createGain();

      this.inputs = {
        "audio": new Synesthesia.IOInterfaces.Audio({
          apiNode: this.api_node,
          context: this.context
        }),
        "gain": new Synesthesia.IOInterfaces.AudioParam({
          apiNode: this.api_node.gain,
          context: this.context
        })
      };

      this.outputs = {
        "audio": new Synesthesia.IOInterfaces.Audio({
          apiNode: this.api_node,
          context: this.context
        })
      };
    }

    Gain.prototype = Object.create(Graph.Node.prototype);

    return Gain;
  })();

});
