module.declare("Nodes/MIDIPitch", [
  "Graph",
  "DataTypes/MIDIMessage",
  "IOInterfaces/MIDI"
], function () {

  var Graph = module.require("Graph");

  var MIDIMessage = module.require("DataTypes/MIDIMessage");

  var IONumber = module.require("IOInterfaces/IONumber");
  var MIDI = module.require("IOInterfaces/MIDI");

  var MIDIPitch = (function () {
    function MIDIPitch (params) {
      Graph.Node.apply(this);

      this.inputs = {
        "midi": new MIDI({
          onMessage: this.onMessage.bind(this)
        }),

        "semitones": new IONumber({
          defaultValue: 0
        })
      };
      
      this.outputs = {
        "midi": new MIDI()
      };
    }

    MIDIPitch.prototype = Object.create(Graph.Node.prototype);

    MIDIPitch.prototype.onMessage = function (message) {
      if (!message.note_number) {
        return;
      }

      var new_data = [].concat(message.data);
      new_data[1] += this.getInput("semitones").get();
      this.getOutput("midi").send(new MIDIMessage({
        data: new_data
      }));
    };

    return MIDIPitch;
  })();

  return MIDIPitch;

});
