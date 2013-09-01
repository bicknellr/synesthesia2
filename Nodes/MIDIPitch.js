module.declare("Nodes/MIDIPitch", [
  "Graph",
  "Synesthesia",
  "IOInterfaces/MIDI"
], function () {

  var Graph = module.require("Graph");
  var Synesthesia = module.require("Synesthesia");

  var MIDI = module.require("IOInterfaces/MIDI");

  var MIDIPitch = (function () {
    function MIDIPitch (params) {
      Graph.Node.apply(this);

      this.inputs = {
        "midi": new MIDI({
          onMessage: this.onMessage.bind(this)
        })
      };
      
      this.outputs = {
        "midi": new MIDI()
      };
    }

    MIDIPitch.prototype = Object.create(Graph.Node.prototype);

    MIDIPitch.prototype.onMessage = function (data, timestamp) {
      this.getOutput("midi").send([data[0], data[1] + 1, data[2]], timestamp);
    };

    return MIDIPitch;
  })();

  return MIDIPitch;

});
