module.declare("Nodes/BitCrusher", [
  "Graph",
  "Synesthesia",
  "IOInterfaces/Audio",
  "IOInterfaces/CustomAudioParam"
], function () {

  var Graph = module.require("Graph");
  var Synesthesia = module.require("Synesthesia");

  Synesthesia.NodeLibrary["BitCrusher"] = (function () {
    function BitCrusher (params) {
      Graph.Node.apply(this);

      this.context = params.audioContext;

      this.api_node = this.context.createScriptProcessor(2048, 2, 2);
      this.api_node.onaudioprocess = this.onAudioProcess.bind(this);

      this.inputs = {
        "audio": new Synesthesia.IOInterfaces.Audio({
          apiNode: this.api_node,
          context: this.context
        }),
        "width": new Synesthesia.IOInterfaces.CustomAudioParam({
          apiNode: this.api_node,
          context: this.context,
          defaultValue: 16,
          bufferSize: 2048
        })
      };

      this.outputs = {
        "audio": new Synesthesia.IOInterfaces.Audio({
          apiNode: this.api_node,
          context: this.context
        })
      };
    }

    BitCrusher.prototype = Object.create(Graph.Node.prototype);

    BitCrusher.prototype.onAudioProcess = function (data) {
      var with_input = this.getInput("width").getSampleData();

      for (var channel_ix = 0; channel_ix < data.outputBuffer.numberOfChannels; channel_ix++) {
        var cur_output_buffer = data.outputBuffer.getChannelData(channel_ix);
        var cur_input_buffer = data.inputBuffer.getChannelData(channel_ix);
        cur_output_buffer.set(
          Array.prototype.map.apply(cur_input_buffer, [
            function (sample, index, array) {
              return Math.round(sample * Math.pow(2, with_input[index])) / Math.pow(2, with_input[index]);
            }
          ])
        );
      }
    };

    return BitCrusher;
  })();

});
