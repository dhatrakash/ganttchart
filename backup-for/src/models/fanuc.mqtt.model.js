const mongoose = require('mongoose');

const fanucControlSchema = mongoose.Schema({
  observation: {
    time: Number,
    machine: String,
    name: String,
    marker: [],
  },
  state: {
    time: Number,
    data: mongoose.Schema.Types.Mixed,
  },
});

const FanucControl = mongoose.model('FanucControl', fanucControlSchema);
module.exports = FanucControl;
