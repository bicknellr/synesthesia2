module.declare("ScriptProcessor", ["Synesthesia", "Graph"], function () {

  var Synesthesia = module.require("Synesthesia");
  var Graph = module.require("Graph");

  Synesthesia.NodeLibrary["ScriptProcessor"] = (function () {
    function ScriptProcessor (params) {
      Graph.Node.apply(this);

      this.context = params.audioContext;

      this.api_node = this.context.createScriptProcessor(
        params.bufferSize,
        params.inputChannelCount,
        params.outputChannelCount
      );

      this.api_node.onaudioprocess = params.callback;

      this.inputs = {
        "audio": new Synesthesia.IOInterfaces.Audio({
          apiNode: this.api_node,
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

    ScriptProcessor.prototype = Object.create(Graph.Node.prototype);

    return ScriptProcessor;
  })();

});
