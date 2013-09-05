module.declare("Nodes/Gain", [
  "Graph",
  "IOInterfaces/Audio",
  "IOInterfaces/AudioParam"
], function () {

  var Graph = module.require("Graph");

  var Audio = module.require("IOInterfaces/Audio");
  var AudioParam = module.require("IOInterfaces/AudioParam");

  var Gain = (function () {
    function Gain (params) {
      Graph.Node.apply(this);

      this.context = params.audioContext;

      this.api_node = this.context.createGain();

      this.inputs = {
        "audio": new Audio({
          apiNode: this.api_node,
          context: this.context
        }),
        "gain": new AudioParam({
          apiNode: this.api_node.gain,
          context: this.context
        })
      };

      this.outputs = {
        "audio": new Audio({
          apiNode: this.api_node,
          context: this.context
        })
      };
    }

    Gain.prototype = Object.create(Graph.Node.prototype);

    return Gain;
  })();

  return Gain;

});
