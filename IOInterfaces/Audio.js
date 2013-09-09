module.declare("IOInterfaces/Audio", [
  "Graph"
], function () {

  var Graph = module.require("Graph");

  var Audio = (function () {
    function Audio (params) {
      params = (typeof params == "undefined" ? {} : params);

      Graph.IOInterface.apply(this);

      this.api_node = params.apiNode;

      this.context = params.context;

      this.addEventListener("connect", function (other_iointerface) {
        this.api_node.connect(other_iointerface.getAPINode());
      }.bind(this));

      this.addEventListener("disconnect", function (other_iointerface) {
        this.api_node.disconnect();

        var connections = this.getConnections();
        for (var conn_ix = 0; conn_ix < connections.length; conn_ix++) {
          this.api_node.connect(connections[conn_ix].getAPINode());
        }
      }.bind(this));
    }

    Audio.prototype = Object.create(Graph.IOInterface.prototype);

    Audio.prototype.getAPINode = function () {
      return this.api_node;
    };

    return Audio;
  })();

  return Audio;

});
