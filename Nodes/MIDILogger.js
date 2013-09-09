module.declare("Nodes/MIDILogger", [
  "Graph",
  "IOInterfaces/MIDI"
], function () {

  var Graph = module.require("Graph");

  var MIDI = module.require("IOInterfaces/MIDI");

  var MIDILogger = (function () {
    function MIDILogger () {
      Graph.Node.apply(this);

      this.inputs = {
        "midi": new MIDI()
      };

      this.getInput("midi").addEventListener("message", this.onMessage.bind(this));

      this.outputs = {};
    }

    MIDILogger.prototype = Object.create(Graph.Node.prototype);

    MIDILogger.prototype.onMessage = function (message) {
      console.log(message);
    };

    return MIDILogger;
  })();

  return MIDILogger;
});
