module.declare("IOInterfaces/AudioParam", [
  "Graph",
  "Synesthesia",
  "IOInterfaces/Audio"
], function () {

  var Graph = module.require("Graph");
  var Synesthesia = module.require("Synesthesia");

  var Audio = module.require("IOInterfaces/Audio");

  var AudioParam = (function () {
    function AudioParam (params) {
      params = (typeof params == "undefined" ? {} : params);

      Audio.apply(this, [params]);

      this.script_node = this.context.createScriptProcessor(2048);
      this.script_node.onaudioprocess = this.onAudioProcess.bind(this);
      this.script_node.connect(this.api_node);

      this.time = 0;

      this.default_value = (typeof params.defaultValue != "undefined" ? params.defaultValue : 0);

      this.automation = null;
    }

    AudioParam.prototype = Object.create(Audio.prototype);

    AudioParam.prototype.getTime = function () {
      return this.time;
    };

    AudioParam.prototype.setTime = function (new_time) {
      this.time = new_time;
    };

    AudioParam.prototype.getDefaultValue = function () {
      return this.default_value;
    };

    AudioParam.prototype.setDefaultValue = function (new_default_value) {
      this.default_value = new_default_value;
    };

    AudioParam.prototype.getAutomation = function () {
      return this.automation;
    };

    AudioParam.prototype.setAutomation = function (new_automation) {
      this.automation = new_automation;
    };

    AudioParam.prototype.onAudioProcess = function (data) {
      for (var channel_ix = 0; channel_ix < data.outputBuffer.numberOfChannels; channel_ix++) {
        var cur_output_buffer = data.outputBuffer.getChannelData(channel_ix);
        if (this.automation == null) {
          cur_output_buffer.set(
            (function () {
              var output_arr = [];
              for (var i = 0; i < cur_output_buffer.length; i++) {
                output_arr[i] = this.default_value;
              }
              return output_arr;
            }).bind(this)()
          );
        } else {
          cur_output_buffer.set(
            this.automation.getSampleRange(this.time, this.context.sampleRate, cur_output_buffer.length)
          );
        }
      }

      this.time += data.outputBuffer.getChannelData(0).length / this.context.sampleRate;
    };

    return AudioParam;
  })();

  return AudioParam;

});
