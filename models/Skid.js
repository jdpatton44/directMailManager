const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

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
                skidDate: {
                        type: Date,
                        default: Date.now,
                },
        },
        {
                toJSON: { virtuals: true },
                toObject: { virtuals: true },
        }
);

module.exports = mongoose.model('Skid', skidSchema);
