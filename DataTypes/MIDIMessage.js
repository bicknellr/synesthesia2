module.declare("DataTypes/MIDIMessage", [], function () {

  var MIDIMessage = (function () {
    function MIDIMessage (params) {
      params = (typeof params == "undefined" ? {} : params);

      this.data = params.data || [];
      this.status = this.data[0];
      this.message_type = (this.status & 0xf0) >> 4;
      this.channel = this.status & 0x0f;

      switch (this.message_type) {
        case MIDIMessage.MessageTypes.NOTE_OFF:
          this.note_number = this.data[1];
          this.velocity = this.data[2];
          break;

        case MIDIMessage.MessageTypes.NOTE_ON:
          this.note_number = this.data[1];
          this.velocity = this.data[2];
          break;

        case MIDIMessage.MessageTypes.AFTERTOUCH:
          this.note_number = this.data[1];
          this.value = this.data[2];
          break;

        case MIDIMessage.MessageTypes.CONTROL_CHANGE:
          this.control_number = this.data[1];
          this.value = this.data[2];
          break;

        case MIDIMessage.MessageTypes.CHANNEL_PRESSURE:
          this.value = this.data[1];
          break;

        case MIDIMessage.MessageTypes.PITCH_WHEEL:
          this.value = (0x7F & this.data[1]) + ((0x7F & this.data[2]) << 7);
          break;
      }
    }

    MIDIMessage.MessageTypes = {
      NOTE_OFF: 0x8,
      NOTE_ON: 0x9,
      AFTERTOUCH: 0xa,
      CONTROL_CHANGE: 0xb,
      PATCH_CHANGE: 0xc,
      CHANNEL_PRESSURE: 0xd,
      PITCH_WHEEL: 0xe
    };

    // SOURCE: http://www.midi.org/techspecs/midi_chart-v2.pdf
    MIDIMessage.ControlNumbers = {
      BANK_SELECT_MSB: 0x00,
      MODULATION_WHEEL_MSB: 0x01,
      BREATH_CONTROLLER_MSB: 0x02,

      FOOT_CONTROLLER_MSB: 0x04,
      PORTAMENTO_TIME_MSB: 0x05,
      DATA_ENTRY_MSB: 0x06,
      CHANNEL_VOLUME_MSB: 0x07,
      BALANCE_MSB: 0x08,

      PAN_MSB: 0x0A,
      EXPRESSION_MSB: 0x0B,
      EFFECT_CONTROL_1_MSB: 0x0C,
      EFFECT_CONTROL_2_MSB: 0x0D,

      GENERAL_PURPOSE_CONTROLLER_1_MSB: 0x10,
      GENERAL_PURPOSE_CONTROLLER_2_MSB: 0x11,
      GENERAL_PURPOSE_CONTROLLER_3_MSB: 0x12,
      GENERAL_PURPOSE_CONTROLLER_4_MSB: 0x13,

      BANK_SELECT_LSB: 0x20,
      MODULATION_WHEEL_LSB: 0x21,
      BREATH_CONTROLLER_LSB: 0x22,

      FOOT_CONTROLLER_LSB: 0x24,
      PORTAMENTO_TIME_LSB: 0x25,
      DATA_ENTRY_LSB: 0x26,
      CHANNEL_VOLUME_LSB: 0x27,
      BALANCE_LSB: 0x28,

      PAN_LSB: 0x2A,
      EXPRESSION: 0x2B,
      EFFECT_CONTROL_1_LSB: 0x2C,
      EFFECT_CONTROL_2_LSB: 0x2D,

      GENERAL_PURPOSE_CONTROLLER_1_LSB: 0x30,
      GENERAL_PURPOSE_CONTROLLER_2_LSB: 0x31,
      GENERAL_PURPOSE_CONTROLLER_3_LSB: 0x32,
      GENERAL_PURPOSE_CONTROLLER_4_LSB: 0x33,

      SUSTAIN_PEDAL: 0x40,
      PORTAMENTO_ON_OFF: 0x41,
      SOSTENUTO: 0x42,
      SOFT_PEDAL: 0x43,
      LEGATO_FOOTSWITCH: 0x44,
      HOLD_2: 0x45,
      SOUND_CONTROLLER_1: 0x46,
        SOUND_VARIATION: 0x46,
      SOUND_CONTROLLER_2: 0x47,
        TIMBRE: 0x47,
      SOUND_CONTROLLER_3: 0x48,
        RELEASE_TIME: 0x48,
      SOUND_CONTROLLER_4: 0x49,
        ATTACK_TIME: 0x49,
      SOUND_CONTROLLER_5: 0x4A,
        BRIGHTNESS: 0x4A,
      SOUND_CONTROLLER_6: 0x4B,
        DECAY_TIME: 0x4B,
      SOUND_CONTROLLER_7: 0x4C,
        VIBRATO_RATE: 0x4C,
      SOUND_CONTROLLER_8: 0x4D,
        VIBRATO_DEPTH: 0x4D,
      SOUND_CONTROLLER_9: 0x4E,
        VIBRATO_DELAY: 0x4E,
      SOUND_CONTROLLER_10: 0x4F,
      GENERAL_PURPOSE_CONTROLLER_5: 0x50,
      GENERAL_PURPOSE_CONTROLLER_6: 0x51,
      GENERAL_PURPOSE_CONTROLLER_7: 0x52,
      GENERAL_PURPOSE_CONTROLLER_8: 0x53,
      PORTAMENTO_CONTROL: 0x55,

      EFFECTS_1_DEPTH: 0x5B,
        REVERB_SEND: 0x5B,
      EFFECTS_2_DEPTH: 0x5C,
        TREMOLO_DEPTH: 0x5C,
      EFFECTS_3_DEPTH: 0x5D,
        CHORUS_SEND: 0x5D,
      EFFECTS_4_DEPTH: 0x5E,
        CELESTE_DEPTH: 0x5E,
      EFFECTS_5_DEPTH: 0x5F,
        PHASER_DEPTH: 0x5F,
      DATA_INCREMENT: 0x60,
      DATA_DECREMENT: 0x61,
      NON_REGISTERED_PARAMETER_NUMBER_LSB: 0x62,
      NON_REGISTERED_PARAMETER_NUMBER_MSB: 0x63,
      REGISTERED_PARAMETER_NUMBER_LSB: 0x64,
      REGISTERED_PARAMETER_NUMBER_MSB: 0x65,

      ALL_SOUND_OFF: 0x78,
      RESET_ALL_CONTROLLERS: 0x79,
      LOCAL_CONTROL_ON_OFF: 0x7A,
      ALL_NOTES_OFF: 0x7B,
      OMNI_MODE_OFF: 0x7C,
      OMNI_MODE_ON: 0x7D,
      POLY_MODE_OFF: 0x7E,
      POLY_MODE_ON: 0x7F
    };

    // SOURCE: http://www.midi.org/techspecs/midimessages.php
    MIDIMessage.RegisteredParameterNumberTypes = {
      PITCH_BEND_SENSITIVITY: 0x0000,
      CHANNEL_FINE_TUNING: 0x0001,
      CHANNEL_COARSE_TUNING: 0x0002,
      TUNING_PROGRAM_CHANGE: 0x0003,
      TUNING_BANK_SELECT: 0x0004,
      MODULATION_DEPTH_RANGE: 0x0005,

      // For 3D sound controllers.
      AZIMUTH_ANGLE: 0x3D00,
      ELEVATION_ANGLE: 0x3D01,
      GAIN: 0x3D02,
      DISTANCE_RATIO: 0x3D03,
      MAXIMUM_DISTANCE: 0x3D04,
      GAIN_AT_MAXIMUM_DISTANCE: 0x3D05,
      REFERENCE_DISTANCE_RATIO: 0x3D06,
      PAN_SPREAD_ANGLE: 0x3D07,
      ROLL_ANGLE: 0x3D08,

      // Setting registered parameter number to 0x7F7F should throw away data entry, data increment, and data decrement controllers.
      NULL_FUNCTION: 0x7F7F
    };

    MIDIMessage.getFrequencyForNoteNumber = function (note_number) {
      // Note number 69 is A at 440Hz.
      return 440 * Math.pow(2, (note_number - 69) / 12);
    };

    MIDIMessage.prototype.getFrequency = function () {
      if (!this.note_number) {
        return 0;
      }

      return MIDIMessage.getFrequencyForNoteNumber(this.note_number);
    };

    return MIDIMessage;
  })();

  return MIDIMessage;

});
