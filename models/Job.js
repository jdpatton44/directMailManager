const moment = require('moment');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

const packageSchema = new mongoose.Schema(
        {
                packageName: {
                        type: String,
                        trim: true,
                        required: 'Please enter a name for this package.',
                },
                packageQuantity: {
                        type: Number,
                        required: 'Please enter the quantity for this package.',
                },
                packageMailingMethod: {
                        type: String,
                        enum: ['1st Class Presort', 'Midwest Commingle', 'PSI Commingle', 'Standard', 'SCF'],
                        required:
                                'Please enter the mailing method for this package, (Commingle, 1st Class Presort, ect.)',
                },
                packagePostage: {
                        type: String,
                        enum: [
                                'NP Indicia',
                                'NP Stamp',
                                'NP Meter',
                                'Standard Stamp',
                                'Standard Meter',
                                'Standard Indicia',
                                '1st Class Stamp',
                                '1st Class Meter',
                        ],
                        required: 'Please enter the postage type.',
                },
                packageMaildate: {
                        type: Date,
                        required: 'Please enter the mail date for this package.',
                },
                packageSize: {
                        type: String,
                        required: 'Please enter the size for this package.',
                },
                packageScitex: {
                        type: Boolean,
                        default: false,
                        required: 'Does this package require scitex?',
                },
                packagePickupDate: {
                        type: Date,
                        default: null,
                },
                commingleQuantity: {
                        type: Number,
                        default: 0,
                },
                comminglePostageDue: {
                        type: Number,
                        default: 0,
                },
        },
        {
                toJSON: { virtuals: true },
                toObject: { virtuals: true },
        }
);

const jobSchema = new mongoose.Schema(
        {
                created: {
                        type: Date,
                        default: Date.now,
                },
                jobName: {
                        type: String,
                        trim: true,
                        required: 'Please enter a name for this job.',
                },
                jobSlug: String,
                jobClient: {
                        type: mongoose.Schema.ObjectId,
                        ref: 'Client',
                        required: 'Please the client for this job.',
                },
                jobRep: {
                        type: mongoose.Schema.ObjectId,
                        ref: 'Rep',
                        required: 'Please the rep for this job.',
                },
                jobMailDate: {
                        type: Date,
                        required: 'Please enter the date this job will mail.',
                },
                jobMailingMethod: [String],
                jobQuantity: {
                        type: Number,
                        required: 'Please enter the aproximate number of piecess for this job.',
                },
                jobSize: {
                        type: String,
                        required: 'Please enter the packages sizes for this job.',
                },
                jobTags: [String],
                jobMatch: {
                        type: Number,
                        min: 0,
                        max: 10,
                },
                jobNotes: {
                        type: String,
                        trim: true,
                },
                packages: {
                        type: [packageSchema],
                        default: [],
                },
        },
        {
                toJSON: { virtuals: true },
                toObject: { virtuals: true },
        }
);

jobSchema.index({
        jobName: 'text',
});

jobSchema.pre('save', function(next) {
        this.jobMailDate = this.jobMailDate + 2.16e7;
        next();
});

jobSchema.pre('save', async function(next) {
        if (!this.isModified('jobName')) {
                next(); // skip it
                return; // stop this function from running
        }
        this.jobSlug = slug(`${this.jobName}-${moment(this.jobMailDate).format('MMMM D YYYY')}`);
        // find other jobs that have a similar slug
        const slugRegEx = new RegExp(`^(${this.jobSlug})((-[0-9]*$)?)$`, 'i');
        const jobswithSlug = await this.constructor.find({ jobSlug: slugRegEx });
        if (jobswithSlug.length) {
                this.jobSlug = `${this.jobSlug}-${jobswithSlug.length + 1}`;
        }
        next();
        // TODO make more resiliant so slugs are unique
});

module.exports = mongoose.model('Job', jobSchema);
