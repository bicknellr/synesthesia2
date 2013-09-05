module.declare("Synesthesia", [
  "Graph"
], function () {

  var Graph = module.require("Graph");

  var Synesthesia = (function () {
    function Synesthesia () {
      this.audio_context = new webkitAudioContext();
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
