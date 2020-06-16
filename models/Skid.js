const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');
const moment = require('moment');

const skidSchema = new mongoose.Schema(
  {
    skidWeight: {
      type: Number,
      required: true,
    },
    skidPackage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Package',
      required: 'Please update the package for this skid.',
    },
    skidJob: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      required: 'Please update the job for this skid.',
    },
    skidInitials: {
      type: String,
      required: 'Please initial this skid.',
    },
    skidTrays: {
      type: Number,
      required: true,
    },
    skidTare: {
      type: Number,
      required: true,
    },
    skidCount: {
      type: Number,
      required: true,
    },
    skidCreatedDate: {
      type: Date,
      default: Date.now,
    },
    skidShipDate: {
      type: Date,
      required: true,
    },
    skidNumber: {
      type: Number,
    },
    shipped: {
      type: Boolean,
      default: false,
    },
    skidTruckDate: {
      type: Date,
    },
    skidTruck: {
      type: mongoose.Schema.ObjectId,
      ref: 'Truck',
    },
    destination: {
      type: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

skidSchema.pre('save', async function(next) {
  this.skidShipDate = this.skidShipDate + 2.16e7;
  next();
});

module.exports = mongoose.model('Skid', skidSchema);
