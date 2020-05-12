const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = global.Promise;
const slug = require('slugs');

const agencySchema = new mongoose.Schema({
        created: {
                type: Date,
                default: Date.now,
        },
        agencyName: {
                type: String,
                trim: true,
                required: "Please enter the agency's Name",
        },
        agencyAddress: {
                type: String,
                trim: true,
        },
        agencyState: {
                type: String,
                trim: true,
                maxlength: 2,
        },
        agencyCity: {
                type: String,
                trim: true,
        },
        agencyZipcode: {
                type: String,
                trim: true,
                minlength: 5,
                maxlength: 10,
        },
        agencyPhoneNumber: {
                type: String,
                trim: true,
                minlength: 7,
                maxlength: 14,
        },
        agencySlug: String,
        agencyNotes: {
                type: String,
                trim: true,
        },
});

agencySchema.pre('save', async function(next) {
        if (!this.isModified('agencyName')) {
                next(); // skip it
                return; // stop this function from running
        }
        this.agencySlug = slug(this.agencyName);
        const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
        const agenciesWithSlug = await this.constructor.find({ slug: slugRegEx });
        if (agenciesWithSlug.length) {
                this.agencySlug = `${this.agencySlug}-${agenciesWithSlug.length + 1}`;
        }
        next();
});

module.exports = mongoose.model('Agency', agencySchema);
