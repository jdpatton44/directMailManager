const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

const rateSchema = new mongoose.Schema(
        {
                rateName: {
                        type: String,
                        required: true,
                },
                rateAmount: {
                        type: Number,
                        required: true,
                },
                rateSlug: {
                        type: String,
                        trim: true,
                },
                rateNotes: {
                        type: String,
                        trim: true,
                },
        },
        {
                toJSON: { virtuals: true },
                toObject: { virtuals: true },
        }
);

rateSchema.pre('save', async function(next) {
        if (!this.isModified('rateName')) {
                next(); // skip it
                return; // stop this function from running
        }
        this.rateSlug = slug(this.rateName);
        const slugRegEx = new RegExp(`^(${this.rateSlug})((-[0-9]*$)?)$`, 'i');
        const ratesWithSlug = await this.constructor.find({ slug: slugRegEx });
        if (ratesWithSlug.length) {
                this.rateSlug = `${this.rateSlug}-${ratesWithSlug.length + 1}`;
        }
        next();
});

module.exports = mongoose.model('Rate', rateSchema);
