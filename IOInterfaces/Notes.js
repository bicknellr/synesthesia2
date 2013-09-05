module.declare("IOInterfaces/Notes", [
  "Graph"
], function () {

  var Graph = module.require("Graph");

  var Notes = (function () {
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

    Notes.prototype.send = function (note, timestamp) {
      var connections = this.getConnections();
      for (var conn_ix = 0; conn_ix < connections.length; conn_ix++) {
        connections[conn_ix].on_message(note, timestamp);
      }
    };

    return Notes;
  })();

  return Notes;

});
