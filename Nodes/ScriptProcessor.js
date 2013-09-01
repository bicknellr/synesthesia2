module.declare("Nodes/ScriptProcessor", [
  "Graph",
  "Synesthesia",
  "IOInterfaces/Audio"
], function () {

  var Graph = module.require("Graph");
  var Synesthesia = module.require("Synesthesia");

  var Audio = module.require("IOInterfaces/Audio");

  var ScriptProcessor = (function () {
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
        "audio": new Audio({
          apiNode: this.api_node,
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

    ScriptProcessor.prototype = Object.create(Graph.Node.prototype);

    return ScriptProcessor;
  })();

  return ScriptProcessor;

});
