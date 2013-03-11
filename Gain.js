Synesthesia.NodeLibrary["Gain"] = (function () {
  function Gain (params) {
    Graph.Node.apply(this);

    this.api_node = params.audioContext.createGain();

    this.inputs = {
      "audio": new Synesthesia.IOInterfaces.Audio({
        apiNode: this.api_node
      }),
      "gain": new Synesthesia.IOInterfaces.Audio({
        apiNode: this.api_node.gain
      })
    };

    this.outputs = {
      "audio": new Synesthesia.IOInterfaces.Audio({
        apiNode: this.api_node
      })
    };
  }

  Gain.prototype = Object.create(Graph.Node.prototype);

  return Gain;
})();
