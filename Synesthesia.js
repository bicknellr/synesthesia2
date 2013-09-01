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

    Synesthesia.prototype.produceNode = function (node_constructor, node_params) {
      node_params = node_params || {};
      node_params.audioContext = this.audio_context;
      return new node_constructor(node_params);
    };

    return Synesthesia;
  })();

  return Synesthesia;

});
