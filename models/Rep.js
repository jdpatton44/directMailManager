const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

const repSchema = new mongoose.Schema({
        repName: {
                type: String,
                trim: true,
                required: "Please enter the Rep's name",
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
                minlength: 7,
                maxlength: 10,
        },
        repPhoneNumber: {
                type: String,
                trim: true,
        },
        repNotes: {
                type: String,
                trim: true,
        },
        repSlug: String,
});

repSchema.pre('save', async function(next) {
        if (!this.isModified('repName')) {
                next(); // skip it
                return; // stop this function from running
        }
        this.slug = slug(this.repName);
        const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
        const repsWithSlug = await this.constructor.find({ slug: slugRegEx });
        if (repsWithSlug.length) {
                this.slug = `${this.slug}-${repsWithSlug.length + 1}`;
        }
        next();
});

module.exports = mongoose.model('Rep', repSchema);
