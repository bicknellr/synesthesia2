module.declare("IOInterfaces/MIDI", [
  "Graph"
], function () {

  var Graph = module.require("Graph");

  var MIDI = (function () {
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

    MIDI.prototype.send = function (data, timestamp) {
      var connections = this.getConnections();
      for (var conn_ix = 0; conn_ix < connections.length; conn_ix++) {
        connections[conn_ix].on_message(data, timestamp);
      }
    };

    return MIDI;
  })();

  return MIDI;

});
