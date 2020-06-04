const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');
const validator = require('validator');

const repSchema = new mongoose.Schema(
  {
    created: {
      type: Date,
      default: Date.now,
    },
    repName: {
      type: String,
      trim: true,
      required: "Please enter the Rep's name",
    },
    repAgency: {
      type: mongoose.Schema.ObjectId,
      ref: 'Agency',
      required: 'Please enter the Agency the Rep works for.',
    },
    repEmail: {
      type: String,
      trim: true,
      validate: [validator.isEmail, 'Invalid Email Address'],
      required: 'Please Supply an email address',
    },
    repAddress: {
      type: String,
      trim: true,
    },
    repState: {
      type: String,
      trim: true,
      maxlength: 2,
    },
    repCity: {
      type: String,
      trim: true,
    },
    repZipcode: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 10,
    },
    repPhoneNumber: {
      type: String,
      trim: true,
      maxlength: 18,
      minlength: 7,
    },
    repNotes: {
      type: String,
      trim: true,
    },
    repSlug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

repSchema.pre('save', async function(next) {
  if (!this.isModified('repName')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.repSlug = slug(this.repName);
  const slugRegEx = new RegExp(`^(${this.repSlug})((-[0-9]*$)?)$`, 'i');
  const repsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (repsWithSlug.length) {
    this.repSlug = `${this.repSlug}-${repsWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model('Rep', repSchema);
