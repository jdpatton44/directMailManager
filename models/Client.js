const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

const clientSchema = new mongoose.Schema({
        clientName: {
                type: String,
                trim: true,
                required: "Please enter the client's Name",
        },
        clientAgency: {
                type: String,
                trim: true,
                // required: "Please select the client's Agency",
        },
        clientCRID: {
                type: String,
                trim: true,
        },
        clientMID: {
                type: String,
                trim: true,
        },
        clientAddress: {
                type: String,
                trim: true,
        },
        clientState: {
                type: String,
                trim: true,
        },
        clientCity: {
                type: String,
                trim: true,
        },
        clientZipcode: {
                type: String,
                trim: true,
        },
        clientPermitNumber: {
                type: String,
                trim: true,
        },
        clientNonProfitNumber: {
                type: String,
                trim: true,
        },
        clientNotes: {
                type: String,
                trim: true,
        },
        clientSlug: String,
});

clientSchema.pre('save', async function(next) {
        if (!this.isModified('clientName')) {
                next(); // skip it
                return; // stop this function from running
        }
        this.slug = slug(this.clientName);
        const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
        const clientswithSlug = await this.constructor.find({ slug: slugRegEx });
        if (clientswithSlug.length) {
                this.slug = `${this.slug}-${clientswithSlug.length + 1}`;
        }
        next();
        // TODO make more resiliant so slugs are unique
});

module.exports = mongoose.model('Client', clientSchema);
