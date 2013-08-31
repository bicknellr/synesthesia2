module.declare("DataTypes/Note", ["Synesthesia"], function () {

  var Synesthesia = module.require("Synesthesia");

  Synesthesia.DataTypes["Note"] = (function () {
    function Note (params) {
      this.frequency = params.frequency;
    }

    Note.prototype.getFrequency = function () {
      return this.frequency;
    };

    return Note;
  })();

});
