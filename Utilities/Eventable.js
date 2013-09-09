module.declare("Utilities/Eventable", [], function () {

  var eventables = [];

  return function (obj) {
    if (eventables.indexOf(obj) != -1) {
      return;
    }
    eventables.push(obj);

    var event_listeners = {};

    obj.addEventListener = function (type, listener) {
      if (!event_listeners[type]) {
        event_listeners[type] = [];
      }

      event_listeners[type].push(listener);
    };

    obj.removeEventListener = function (type, listener) {
      if (!event_listeners[type]) {
        return;
      }

      var listeners_for_type = event_listeners[type];
      var listener_index = listeners_for_type.indexOf(listener);
      if (listener_index == -1) {
        return;
      }

      listeners_for_type.splice(listener_index, 1)[0];
    };

    obj.launchEvent = function (type) {
      if (!event_listeners[type]) {
        return;
      }

      var listener_args = Array.prototype.slice.call(arguments);
      listener_args.shift();

      var listeners_for_type = event_listeners[type];

      for (var listener_ix = 0; listener_ix < listeners_for_type.length; listener_ix++) {
        listeners_for_type[listener_ix].apply(undefined, listener_args);
      }
    };
  };

});
