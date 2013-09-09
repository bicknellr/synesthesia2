module.declare("IOInterfaces/IONumber", [
  "Graph"
], function () {

  var Graph = module.require("Graph");

  var IONumber = (function () {
    function IONumber (params) {
      params = (typeof params == "undefined" ? {} : params);

      Graph.IOInterface.apply(this);

      this.value = params.defaultValue;
    }

    IONumber.prototype = Object.create(Graph.IOInterface.prototype);

    IONumber.prototype.set = function (new_value) {
      if (typeof new_value !== "number") {
        console.warn("IONumber(.set): New value is not a number!");
        return;
      }

      this.value = new_value;

      this.launchEvent("set", this.value);

      var connections = this.getConnections();
      for (var i = 0; i < connections.length; i++) {
        connections.set(this.value);
      }
    };

    IONumber.prototype.get = function () {
      return this.value;
    };

    return IONumber;
  })();

  return IONumber;

});
