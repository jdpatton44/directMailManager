const mongoose = require('mongoose');
const skidSchema = require('./Skid');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.Promise = global.Promise;


const truckSchema = new mongoose.Schema({
  truckCreatedDate: {
    type: Date,
    default: Date.now,
  },
  truckType: {
    type: String,
  },
  truckSkids: { type: [String], default: [], required: false },

});

truckSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('Truck', truckSchema);
