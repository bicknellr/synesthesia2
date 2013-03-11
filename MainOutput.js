Synesthesia.NodeLibrary["MainOutput"] = (function () {
  function MainOutput (params) {
    Graph.Node.apply(this);

    this.api_node = params.audioContext.destination;

    this.inputs = {
      "audio": new Synesthesia.IOInterfaces.Audio({
        apiNode: this.api_node
      })
    };

    this.outputs = {};
  }

  MainOutput.prototype = Object.create(Graph.Node.prototype);

  return MainOutput;
})();
