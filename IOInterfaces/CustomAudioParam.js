module.declare("IOInterfaces/CustomAudioParam", [
  "Graph",
  "Synesthesia",
  "IOInterfaces/AudioParam"
], function () {

  var Graph = module.require("Graph");
  var Synesthesia = module.require("Synesthesia");

  var AudioParam = module.require("IOInterfaces/AudioParam");

  var CustomAudioParam = (function () {
    function CustomAudioParam (params) {
      params = (typeof params == "undefined" ? {} : params);

      this.api_node = params.apiNode;

      this.context = params.context;

      this.buffer_size = params.bufferSize || 2048;

      this.gain_sink = this.context.createGain();
      this.gain_sink.gain.setValueAtTime(0, 0);
      this.gain_sink.connect(params.apiNode);

      this.sample_recorder = this.context.createScriptProcessor(this.buffer_size, 1, 1);
      this.sample_recorder.onaudioprocess = this.onSampleRecord.bind(this);
      this.sample_recorder.connect(this.gain_sink);

      this.gain_modifier = this.context.createGain();
      this.gain_modifier.connect(this.sample_recorder);

      this.one_producer = this.context.createScriptProcessor(this.buffer_size, 1, 1);
      this.one_producer.onaudioprocess = (function () {
        var ones = [];
        for (var i = 0; i < this.buffer_size; i++) {
          ones.push(1);
        }

        return function (data) {
          data.outputBuffer.getChannelData(0).set(ones);
        };
      }).bind(this)();
      this.one_producer.connect(this.gain_modifier);

      AudioParam.apply(this, [{
        apiNode: this.gain_modifier.gain,
        context: this.context,
        defaultValue: params.defaultValue
      }]);

      this.sample_data = new Float32Array(this.buffer_size);
    }

    CustomAudioParam.prototype = Object.create(AudioParam.prototype);

    CustomAudioParam.prototype.onSampleRecord = function (data) {
      this.sample_data.set(data.inputBuffer.getChannelData(0));
    };

    CustomAudioParam.prototype.getSampleData = function () {
      return this.sample_data;
    };

    return CustomAudioParam;
  })();

  return CustomAudioParam;

});
