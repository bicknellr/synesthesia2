module.declare("Synesthesia", ["Graph"], function () {

  var Graph = module.require("Graph");

  var Synesthesia = (function () {
    function Synesthesia () {
      this.audio_context = new webkitAudioContext();

      this.midi_access = null;
      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess(
          (function (midi_access, system_exclusive_allowed) {
            this.midi_access = midi_access;
          }).bind(this),
          (function (error) {
            console.error(error);
          }).bind(this)
        );
      }
    }

    Synesthesia.NodeLibrary = {};

    Synesthesia.prototype.produceNode = function (node_name, node_params) {
      node_params = node_params || {};
      node_params.audioContext = this.audio_context;
      return new Synesthesia.NodeLibrary[node_name](node_params);
    };

    return Synesthesia;
  })();

  Synesthesia.IOInterfaces = (function () {
    var IOInterfaces = {};

    IOInterfaces.Audio = (function () {
      function Audio (params) {
        params = (typeof params == "undefined" ? {} : params);

        Graph.IOInterface.apply(this);

        this.api_node = params.apiNode;

        this.context = params.context;

        this.on_connect = (function (other_iointerface) {
          this.api_node.connect(other_iointerface.getAPINode());
        }).bind(this);

        this.on_disconnect = (function (other_iointerface) {
          this.api_node.disconnect();

          var connections = this.getConnections();
          for (var conn_ix = 0; conn_ix < connections.length; conn_ix++) {
            this.api_node.connect(connections[conn_ix].getAPINode());
          }
        }).bind(this);
      }

      Audio.prototype = Object.create(Graph.IOInterface.prototype);

      Audio.prototype.getAPINode = function () {
        return this.api_node;
      };

      return Audio;
    })();

    IOInterfaces.AudioParam = (function () {
      function AudioParam (params) {
        params = (typeof params == "undefined" ? {} : params);

        Synesthesia.IOInterfaces.Audio.apply(this, [params]);

        this.script_node = this.context.createScriptProcessor(2048);
        this.script_node.onaudioprocess = this.onAudioProcess.bind(this);
        this.script_node.connect(this.api_node);

        this.time = 0;

        this.default_value = (typeof params.defaultValue != "undefined" ? params.defaultValue : 0);

        this.automation = null;
      }

      AudioParam.prototype = Object.create(IOInterfaces.Audio.prototype);

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

    IOInterfaces.CustomAudioParam = (function () {
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

        Synesthesia.IOInterfaces.AudioParam.apply(this, [{
          apiNode: this.gain_modifier.gain,
          context: this.context,
          defaultValue: params.defaultValue
        }]);

        this.sample_data = new Float32Array(this.buffer_size);
      }

      CustomAudioParam.prototype = Object.create(IOInterfaces.AudioParam.prototype);

      CustomAudioParam.prototype.onSampleRecord = function (data) {
        this.sample_data.set(data.inputBuffer.getChannelData(0));
      };

      CustomAudioParam.prototype.getSampleData = function () {
        return this.sample_data;
      };

      return CustomAudioParam;
    })();

    IOInterfaces.Notes = (function () {
      function Notes (params) {
        params = (typeof params == "undefined" ? {} : params);

        Graph.IOInterface.apply(this);

        this.on_connect = (function (other_iointerface) {
        }).bind(this);

        this.on_disconnect = (function (other_iointerface) {
        }).bind(this);

        this.on_message = params.onMessage || function () {};
      }

      Notes.prototype = Object.create(Graph.IOInterface.prototype);

      Notes.prototype.send = function (note, timestamp) {
        var connections = this.getConnections();
        for (var conn_ix = 0; conn_ix < connections.length; conn_ix++) {
          connections[conn_ix].on_message(note, timestamp);
        }
      };

      return Notes;
    })();

    IOInterfaces.MIDI = (function () {
      function MIDI (params) {
        params = (typeof params == "undefined" ? {} : params);

        Graph.IOInterface.apply(this);

        this.on_connect = (function (other_iointerface) {
        }).bind(this);

        this.on_disconnect = (function (other_iointerface) {
        }).bind(this);

        this.on_message = params.onMessage || function () {};
      }

      MIDI.prototype = Object.create(Graph.IOInterface.prototype);

      MIDI.getFrequencyForNoteNumber = function (note_number) {
        // Note number 69 is A at 440Hz.
        return 440 * Math.pow(2, (note_number - 69) / 12);
      };

      MIDI.prototype.send = function (data, timestamp) {
        var connections = this.getConnections();
        for (var conn_ix = 0; conn_ix < connections.length; conn_ix++) {
          connections[conn_ix].on_message(data, timestamp);
        }
      };

      return MIDI;
    })();

    return IOInterfaces;
  })();

  Synesthesia.DataTypes = (function () {
    var DataTypes = {};

    DataTypes.Note = (function () {
      function Note (params) {
        this.frequency = params.frequency;
      }

      Note.prototype.getFrequency = function () {
        return this.frequency;
      };

      return Note;
    })();

    DataTypes.Automation = (function () {
      function Automation (params) {
        params = (typeof params == "undefined" ? {} : params);

        this.keyframes = [];
      }

      Automation.Keyframe = (function () {
        function Keyframe (params) {
          params = (typeof params == "undefined" ? {} : params);

          this.value = params.value || 0;
          this.time = params.time || 0;
          this.curve = params.curve || Keyframe.Curves.Set;
        }

        Keyframe.Curves = {
          Set: function (a, b, t) {
            return (t != 1 ? a : b);
          },
          Linear: function (a, b, t) {
            return a + (b - a) * t;
          },
          Exponential: function (a, b, t) {
            return a * Math.pow(b / a, t);
          }
        };

        Keyframe.prototype.getValue = function () {
          return this.value;
        };

        Keyframe.prototype.getTime = function () {
          return this.time;
        };

        Keyframe.prototype.getCurve = function () {
          return this.curve;
        };

        return Keyframe;
      })();

      Automation.prototype.addKeyframe = function (keyframe) {
        this.keyframes.push(keyframe);
        this.keyframes.sort(function (a, b) {
          return a.getTime() - b.getTime();
        });
      };

      Automation.prototype.getValueAtTime = function (time) {
        var before = null;
        var after = null;

        for (var keyframe_ix = 0; keyframe_ix < this.keyframes.length; keyframe_ix++) {
          var cur_keyframe = this.keyframes[keyframe_ix];
          var next_keyframe = this.keyframes[keyframe_ix + 1];

          if (cur_keyframe.getTime() > time) {
            return 0;
          }

          if (!next_keyframe) {
            before = cur_keyframe;
            break;
          }

          if ((next_keyframe.getTime() > time) && (cur_keyframe.getTime() <= time)) {
            before = cur_keyframe;
            after = next_keyframe;
            break;
          }
        }

        if (!after) {
          return before.getValue();
        }

        var t = (time - before.getTime()) / (after.getTime() - before.getTime());

        return after.getCurve()(before.getValue(), after.getValue(), t);
      };

      Automation.prototype.getSampleRange = function (start_time, sample_rate, sample_count) {
        var output = [];
        for (var sample_ix = 0; sample_ix < sample_count; sample_ix++) {
          output.push(this.getValueAtTime(start_time + 1 / sample_rate * sample_ix));
        }
        return output;
      };

      return Automation;
    })();

    return DataTypes;
  })();

  return Synesthesia;

});
