module.declare("MIDISource", ["Synesthesia", "Graph"], function () {

  var Synesthesia = module.require("Synesthesia");
  var Graph = module.require("Graph");

  Synesthesia.NodeLibrary["MIDISource"] = (function () {
    function MIDISource (params) {
      Graph.Node.apply(this);

      this.context = params.audioContext;

      this.inputs = {};

      this.outputs = {
        "midi": new Synesthesia.IOInterfaces.MIDI()
      };

      this.init();
    }

    MIDISource.canaryPolyfillMIDIAccess = function (access) {
      console.warn("MIDISource(.canaryPolyfillMIDIAccess): Attempting to polyfill MIDIAccess object...");

      var MIDIPortPolyfill = (function () {
        function MIDIPortPolyfill (input_or_output) {
          Object.defineProperties(this, {
            "_input_or_output": {
              enumerable: true,
              writable: false,
              value: input_or_output,
            },
            "id": {
              enumerable: true,
              writable: false,
              value: input_or_output.id,
            },
            "manufacturer": {
              enumerable: true,
              writable: false,
              value: input_or_output.manufacturer,
            },
            "name": {
              enumerable: true,
              writable: false,
              value: input_or_output.name,
            },
            "type": {
              enumerable: true,
              writable: false,
              value: input_or_output.type,
            },
            "version": {
              enumerable: true,
              writable: false,
              value: input_or_output.version,
            },
            "ondisconnect": {
              enumerable: true,
              get: function () {
                return input_or_output.ondisconnect.bind(input_or_output);
              },
              set: function (new_value) {
                return (input_or_output.ondisconnect = new_value);
              }
            }
          });
        }

        return MIDIPortPolyfill;
      })();
      
      var NotFoundError = NotFoundError || (function () {
        function NotFoundError () {}

        NotFoundError.prototype = Object.create(Error);

        return NotFoundError;
      });
      
      var NotSupportedError = NotSupportedError || (function () {
        function NotSupportedError () {}

        NotSupportedError.prototype = Object.create(Error);

        return NotSupportedError;
      });

      if (!access.getInputs) {
        console.warn("MIDISource(.canaryPolyfillMIDIAccess): `getInputs` needs polyfill.");
        access.getInputs = (function () {
          var id_to_port_map = {};

          return function () {
            return this.inputs().map(function (canary_midi_input) {
              var memoized_port = id_to_port_map[canary_midi_input.id];
              if (memoized_port) {
                return memoized_port;
              }
              
              return id_to_port_map[canary_midi_input.id] = new MIDIPortPolyfill(canary_midi_input);
            });
          };
        })();
      }

      if (!access.getInput) {
        console.warn("MIDISource(.canaryPolyfillMIDIAccess): `getInput` needs polyfill.");

        access.getInput = function (target) {
          var ports = this.getInputs();

          if (typeof target === "string") {
            // Select by `id` property.

            for (var i = 0; i < ports.length; i++) {
              if (ports[i].id == target) {
                return ports[i]._input_or_output;
              }
            }

            throw new NotFoundError("Could not find MIDI input with id '" + target + "'!");
          } else if (typeof target === "number") {
            // Select by index in ports array.

            var port = ports[target];
            if (!port) {
              throw new NotFoundError("Invalid index '" + target + "' for MIDI input!");
            }

            return port._input_or_output;
          } else if (MIDIPortPolyfill.prototype.isPrototypeOf(target)) {
            // Select by passing MIDIPortPolyfill.

            for (var i = 0; i < ports.length; i++) {
              if (ports[i] == target) {
                return ports[i]._input_or_output;
              }
            }

            throw new NotFoundError("Could not find MIDI input matching the given port!");
          }

          throw new NotSupportedError("Invalid target for MIDI input!");
        };
      }

      if (!access.getOutputs) {
        console.warn("MIDISource(.canaryPolyfillMIDIAccess): `getOutputs` needs polyfill.");
        access.getOutputs = (function () {
          var id_to_port_map = {};

          return function () {
            return this.outputs().map(function (canary_midi_output) {
              var memoized_port = id_to_port_map[canary_midi_output.id];
              if (memoized_port) {
                return memoized_port;
              }
              
              return id_to_port_map[canary_midi_output.id] = new MIDIPortPolyfill(canary_midi_output);
            });
          };
        })();
      }

      if (!access.getOutput) {
        console.warn("MIDISource(.canaryPolyfillMIDIAccess): `getOutput` needs polyfill.");

        access.getOutput = function (target) {
          var ports = this.getOutputs();

          if (typeof target === "string") {
            // Select by `id` property.

            for (var i = 0; i < ports.length; i++) {
              if (ports[i].id == target) {
                return ports[i]._input_or_output;
              }
            }

            throw new NotFoundError("Could not find MIDI output with id '" + target + "'!");
          } else if (typeof target === "number") {
            // Select by index in ports array.

            var port = ports[target];
            if (!port) {
              throw new NotFoundError("Invalid index '" + target + "' for MIDI output!");
            }

            return port._input_or_output;
          } else if (MIDIPortPolyfill.prototype.isPrototypeOf(target)) {
            // Select by passing MIDIPortPolyfill.

            for (var i = 0; i < ports.length; i++) {
              if (ports[i] == target) {
                return ports[i]._input_or_output;
              }
            }

            throw new NotFoundError("Could not find MIDI output matching the given port!");
          }

          throw new NotSupportedError("Invalid target for MIDI output!");
        };
      }
    };

    MIDISource.prototype.init = function () {
      navigator.requestMIDIAccess().then(
        this.requestMIDIAccess_success.bind(this),
        this.requestMIDIAccess_failure.bind(this)
      );
    };

    MIDISource.prototype.requestMIDIAccess_success = function (access, options) {
      console.log("MIDISource(.requestMIDIAccess_success): Acquired MIDIAccess object.");

      MIDISource.canaryPolyfillMIDIAccess(access);

      console.log("MIDISource(.requestMIDIAccess_success): access\n", access);
      access.onconnect = this.access_onconnect.bind(this);
      access.ondisconnect = this.access_ondisconnect.bind(this);

      console.log("MIDISource(.requestMIDIAccess_success): access.getInputs()\n", access.getInputs());
      console.log("MIDISource(.requestMIDIAccess_success): access.getInput(0)\n", access.getInput(0));

      console.log("MIDISource(.requestMIDIAccess_success): access.getOutputs()\n", access.getOutputs());
      console.log("MIDISource(.requestMIDIAccess_success): access.getOutput(0)\n", access.getOutput(0));
      access.getInput(0).onmidimessage = this.onmidimessage.bind(this);
    };

    MIDISource.prototype.requestMIDIAccess_failure = function (err) {
      console.log("MIDISource(.requestMIDIAccess_failure): Failed to acquire MIDIAccess object!");
    };

    MIDISource.prototype.access_onconnect = function () {
      console.log("MIDISource(.access_onconnect):\n", arguments);
    };

    MIDISource.prototype.access_ondisconnect = function () {
      console.log("MIDISource(.access_ondisconnect):\n", arguments);
    };

    MIDISource.prototype.onmidimessage = function () {
      console.log(arguments);
    };

    return MIDISource;
  })();

});