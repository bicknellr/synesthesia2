module.declare("Synesthesia", [
  "Graph"
], function () {

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

  Synesthesia.IOInterfaces = {};

  Synesthesia.DataTypes = {};

  return Synesthesia;

});
