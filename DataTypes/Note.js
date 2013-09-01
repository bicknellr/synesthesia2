module.declare("DataTypes/Note", [], function () {

  var Note = (function () {
    function Note (params) {
      this.frequency = params.frequency;
    }

    Note.prototype.getFrequency = function () {
      return this.frequency;
    };

    return Note;
  })();

  return Note;

});
