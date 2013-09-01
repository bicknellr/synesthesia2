module.declare("DataTypes/Automation", [
  "Synesthesia"
], function () {

  var Synesthesia = module.require("Synesthesia");

  var Automation = (function () {
    function Automation (params) {
      params = (typeof params == "undefined" ? {} : params);

      this.keyframes = [];
    }

    Automation.Keyframe = (function () {
      function Keyframe (params) {
        params = (typeof params == "undefined" ? {} : params);

        this.value = params.value || 0;
        this.time = params.time || 0;
        this.curve = params.curve || Keyframe.Curves.Set;
      }

      Keyframe.Curves = {
        Set: function (a, b, t) {
          return (t != 1 ? a : b);
        },
        Linear: function (a, b, t) {
          return a + (b - a) * t;
        },
        Exponential: function (a, b, t) {
          return a * Math.pow(b / a, t);
        }
      };

      Keyframe.prototype.getValue = function () {
        return this.value;
      };

      Keyframe.prototype.getTime = function () {
        return this.time;
      };

      Keyframe.prototype.getCurve = function () {
        return this.curve;
      };

      return Keyframe;
    })();

    Automation.prototype.addKeyframe = function (keyframe) {
      this.keyframes.push(keyframe);
      this.keyframes.sort(function (a, b) {
        return a.getTime() - b.getTime();
      });
    };

    Automation.prototype.getValueAtTime = function (time) {
      var before = null;
      var after = null;

      for (var keyframe_ix = 0; keyframe_ix < this.keyframes.length; keyframe_ix++) {
        var cur_keyframe = this.keyframes[keyframe_ix];
        var next_keyframe = this.keyframes[keyframe_ix + 1];

        if (cur_keyframe.getTime() > time) {
          return 0;
        }

        if (!next_keyframe) {
          before = cur_keyframe;
          break;
        }

        if ((next_keyframe.getTime() > time) && (cur_keyframe.getTime() <= time)) {
          before = cur_keyframe;
          after = next_keyframe;
          break;
        }
      }

      if (!after) {
        return before.getValue();
      }

      var t = (time - before.getTime()) / (after.getTime() - before.getTime());

      return after.getCurve()(before.getValue(), after.getValue(), t);
    };

    Automation.prototype.getSampleRange = function (start_time, sample_rate, sample_count) {
      var output = [];
      for (var sample_ix = 0; sample_ix < sample_count; sample_ix++) {
        output.push(this.getValueAtTime(start_time + 1 / sample_rate * sample_ix));
      }
      return output;
    };

    return Automation;
  })();

  return Automation;

});
