Synesthesia.NodeLibrary["ScriptProcessor"] = (function () {
  function ScriptProcessor (params) {
    Graph.Node.apply(this);

    this.api_node = params.audioContext.createScriptProcessor(
      params.bufferSize,
      params.inputChannelCount,
      params.outputChannelCount
    );

    this.api_node.onaudioprocess = params.callback;

    this.inputs = {
      "audio": new Synesthesia.IOInterfaces.Audio({
        apiNode: this.api_node
      })
    };

    this.outputs = {
      "audio": new Synesthesia.IOInterfaces.Audio({
        apiNode: this.api_node
      })
    };
  }

  ScriptProcessor.prototype = Object.create(Graph.Node.prototype);

  return ScriptProcessor;
})();
