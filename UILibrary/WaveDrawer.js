module.declare("UILibrary/WaveDrawer", [], function () {

  var WaveDrawer = (function () {
    function WaveDrawer (params) {
      this.canvas = params.canvas;
      this.context = this.canvas.getContext("2d");

      this.channels = [];

      this.colors = [
        "rgba(255, 0, 0, 255)",
        "rgba(0, 255, 0, 255)",
        "rgba(0, 0, 255, 255)",
        "rgba(255, 0, 255, 255)",
      ];
    }

    WaveDrawer.prototype.pushSamples = function (channel, new_samples) {
      if (!this.channels[channel]) {
        this.channels[channel] = [];
      }

      var cur_channel = this.channels[channel];

      // Add new channel data.
      cur_channel = cur_channel.concat(new_samples);

      // Remove non-visible samples.
      cur_channel = cur_channel.slice(
        cur_channel.length - (+this.canvas.width),
        cur_channel.length + 1
      );

      // Draw.
      var ctx = this.context;
      ctx.globalCompositeOperation = "lighter";
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.beginPath();
      for (var i = cur_channel.length - 1; i >= 0; i--) {
        var y_pos = (this.canvas.height / 2) * -cur_channel[i] + this.canvas.height / 2;
        if (i == cur_channel.length - 1) {
          ctx.moveTo(i, y_pos);
        } else {
          ctx.lineTo(i, y_pos);
        }
      }
      ctx.strokeStyle = this.colors[channel % this.colors.length];
      ctx.stroke();
    };

    return WaveDrawer;
  })();

  return WaveDrawer;

});
