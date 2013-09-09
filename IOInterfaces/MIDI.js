module.declare("IOInterfaces/MIDI", [
  "Graph"
], function () {

  var Graph = module.require("Graph");

  var MIDI = (function () {
    function MIDI (params) {
      params = (typeof params == "undefined" ? {} : params);

      Graph.IOInterface.apply(this);
    }

    MIDI.prototype = Object.create(Graph.IOInterface.prototype);

    MIDI.prototype.send = function (data, timestamp) {
      this.launchEvent("message", data, timestamp);

      var connections = this.getConnections();
      for (var conn_ix = 0; conn_ix < connections.length; conn_ix++) {
        connections[conn_ix].send(data, timestamp);
      }
    };

    return MIDI;
  })();

  return MIDI;

});
