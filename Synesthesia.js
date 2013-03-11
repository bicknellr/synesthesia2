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

Synesthesia.IOInterfaces = {
  Audio: (function () {
    function Audio (params) {
      params = (typeof params == "undefined" ? {} : params);

      Graph.IOInterface.apply(this);

      this.api_node = params.apiNode;

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
  })(),

  Notes: (function () {
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

    Notes.Note = (function () {
      function Note (params) {
        this.frequency = params.frequency;
      }

      Note.prototype.getFrequency = function () {
        return this.frequency;
      };

      return Note;
    })();

    Notes.prototype.send = function (note, timestamp) {
      var connections = this.getConnections();
      for (var conn_ix = 0; conn_ix < connections.length; conn_ix++) {
        connections[conn_ix].on_message(note, timestamp);
      }
    };

    return Notes;
  })(),

  MIDI: (function () {
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
  })()
};
