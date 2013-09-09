module.declare("Graph", [
  "Utilities/Eventable"
], function () {

  var Eventable = module.require("Utilities/Eventable");

  var Graph = {};

  Graph.Node = (function () {
    function Node () {
      // override
      this.inputs = {};
      this.outputs = {};
    }

    Node.prototype.getInputKeys = function () {
      return Object.keys(this.inputs);
    };

    Node.prototype.getOutputKeys = function () {
      return Object.keys(this.outputs);
    };

    Node.prototype.getInput = function (input_name) {
      return this.inputs[input_name];
    };

    Node.prototype.getOutput = function (output_name) {
      return this.outputs[output_name];
    };

    return Node;
  })();

  Graph.IOInterface = (function () {
    function IOInterface () {
      Eventable(this);

      this.connections = [];
    }

    IOInterface.prototype.getConnections = function () {
      return this.connections;
    };

    IOInterface.prototype.connectTo = function (other_iointerface) {
      if (this.connections.indexOf(other_iointerface) != -1) {
        console.warn("Graph.IOInterface(.connectTo): Attempted redundant connection.");
        return;
      }

      this.connections.push(other_iointerface);

      this.launchEvent("connect", other_iointerface);
    };

    IOInterface.prototype.disconnectTo = function (other_iointerface) {
      if (this.connections.indexOf(other_iointerface) == -1) {
        throw new Error("Graph.IOInterface(.disconnectTo): No such connected IOInterface.");
      }

      this.connections.splice(this.connections.indexOf(other_iointerface), 1);

      this.launchEvent("disconnect", other_iointerface);
    };

    return IOInterface;
  })();

  return Graph;

});
