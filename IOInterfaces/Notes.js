module.declare("IOInterfaces/Notes", [
  "Graph"
], function () {

  var Graph = module.require("Graph");

  var Notes = (function () {
    function Notes (params) {
      params = (typeof params == "undefined" ? {} : params);

      Graph.IOInterface.apply(this);
    }

    Notes.prototype = Object.create(Graph.IOInterface.prototype);

    Notes.prototype.send = function (note, timestamp) {
      this.launchEvent("message", note, timestamp);

      var connections = this.getConnections();
      for (var conn_ix = 0; conn_ix < connections.length; conn_ix++) {
        connections[conn_ix].send(note, timestamp);
      }
    };

    return Notes;
  })();

  return Notes;

});
