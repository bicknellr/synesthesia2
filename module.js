window.module = {
  modules: {},

  check_modules: function () {
    var changes = false;

    to_next_module: for (var mod_ix in this.modules) {
      cur_module = this.modules[mod_ix];

      if (cur_module.processed) continue;

      for (var req_ix = 0; req_ix < cur_module.dependencies.length; req_ix++) {
        var req_name = cur_module.dependencies[req_ix];
        if (!this.modules[req_name]) {
          console.log("module: Dependency '" + req_name + "' for '" + cur_module.name + "' not found.");
          continue to_next_module;
        }
        if (!this.modules[req_name].processed) {
          console.log("module: Dependency '" + req_name + "' for '" + cur_module.name + "' not processed.");
          continue to_next_module;
        }
      }

      console.log("module: Processing '" + cur_module.name + "'.");

      try {
        var before = [];
        for (var prop in window) {
          before.push(prop);
        }

        // Run the module.
        cur_module.exports = cur_module.callback.apply(window);

        var after = [];
        for (var prop in window) {
          after.push(prop);
        }

        var polluted_variables = [];

        for (var i = 0; i < after.length; i++) {
          if (before.indexOf(after[i]) == -1) {
            polluted_variables.push(after[i]);
          }
        }
        
        if (polluted_variables.length > 0) {
          console.warn("module: Global namespace pollution found in '" + cur_module.name + "':\n    " + (polluted_variables.join("\n    ")));
        }
      } catch (e) {
        if (e.stack) {
          console.error("module: Processing '" + cur_module.name + "' failed:\nStack:\n" + e.stack.toString() + "\nError:\n" + e.toString());
        } else {
          console.error("module: Processing '" + cur_module.name + "' failed:");
          console.error(e);
        }
        continue to_next_module;
      };

      changes = true;
      cur_module.processed = true;
    }

    if (changes) this.check_modules();
  },

  declare: function (name, dependencies, callback) {
    this.modules[name] = {
      name: name,
      dependencies: dependencies,
      callback: callback,
      exports: {},
      processed: false
    };

    this.check_modules();
  },

  require: function (name) {
    if (!this.modules[name]) {
      throw new Error("module: Unsatisfied dependency (" + name + ") requested!");
    }
    return this.modules[name].exports;
  }
};
