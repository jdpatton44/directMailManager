const mongoose = require('mongoose');
const skidSchema = require('./Skid');

mongoose.Promise = global.Promise;

const truckSchema = new mongoose.Schema({
  truckCreatedDate: {
    type: Date,
    default: Date.now,
  },
  truckSkids: { type: [String], default: [], required: false },
});

module.exports = mongoose.model('Truck', truckSchema);
