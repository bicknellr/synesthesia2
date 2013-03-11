Synesthesia.NodeLibrary["Oscillator"] = (function () {
  function Oscillator (params) {
    Graph.Node.apply(this);

    this.api_node = params.audioContext.createOscillator();

    this.inputs = {
      "notes": new Synesthesia.IOInterfaces.Notes({
        onMessage: this.onNoteMessage.bind(this)
      }),
      "frequency": new Synesthesia.IOInterfaces.Audio({
        apiNode: this.api_node.frequency
      }),
      "detune": new Synesthesia.IOInterfaces.Audio({
        apiNode: this.api_node.detune
      })
    };

    this.outputs = {
      "audio": new Synesthesia.IOInterfaces.Audio({
        apiNode: this.api_node
      })
    };
  }

  Oscillator.prototype = Object.create(Graph.Node.prototype);

  Oscillator.prototype.onNoteMessage = function (note, timestamp) {
    console.log("note: " + note + " timestamp: " + timestamp);
  };

  return Oscillator;
})();
