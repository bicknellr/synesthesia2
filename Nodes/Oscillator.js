module.declare("Nodes/Oscillator", [
  "Graph",
  "IOInterfaces/Audio",
  "IOInterfaces/AudioParam"
], function () {

  var Graph = module.require("Graph");

  var Audio = module.require("IOInterfaces/Audio");
  var AudioParam = module.require("IOInterfaces/AudioParam");

  var Oscillator = (function () {
    function Oscillator (params) {
      Graph.Node.apply(this);

      this.context = params.audioContext;

      this.api_node = this.context.createOscillator();

      this.inputs = {
        "frequency": new AudioParam({
          apiNode: this.api_node.frequency,
          context: this.context
        }),
        "detune": new AudioParam({
          apiNode: this.api_node.detune,
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

    Oscillator.prototype = Object.create(Graph.Node.prototype);

    return Oscillator;
  })();

  return Oscillator;

});
