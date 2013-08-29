module.declare("Oscillator", ["Synesthesia", "Graph"], function () {

  var Synesthesia = module.require("Synesthesia");
  var Graph = module.require("Graph");

  Synesthesia.NodeLibrary["Oscillator"] = (function () {
    function Oscillator (params) {
      Graph.Node.apply(this);

      this.context = params.audioContext;

      this.api_node = this.context.createOscillator();

      this.inputs = {
        "frequency": new Synesthesia.IOInterfaces.AudioParam({
          apiNode: this.api_node.frequency,
          context: this.context
        }),
        "detune": new Synesthesia.IOInterfaces.AudioParam({
          apiNode: this.api_node.detune,
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

    Oscillator.prototype = Object.create(Graph.Node.prototype);

    return Oscillator;
  })();

});
