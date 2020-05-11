const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

const clientSchema = new mongoose.Schema(
        {
                created: {
                        type: Date,
                        default: Date.now,
                },
                clientName: {
                        type: String,
                        trim: true,
                        required: "Please enter the client's Name",
                },
                clientAbrv: {
                        type: String,
                        trim: true,
                        required: "Please enter a abbreviation for the client."
                },
                clientAgency: {
                        type: mongoose.Schema.ObjectId,
                        trim: true,
                        required: "Please select the client's Agency",
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
        },
        {
                toJSON: { virtuals: true },
                toObject: { virtuals: true },
        }
);

clientSchema.pre('save', async function(next) {
        if (!this.isModified('clientName')) {
                next();
                return;
        }
        this.clientSlug = slug(this.clientName);
        const slugRegEx = new RegExp(`^(${this.clientSlug})((-[0-9]*$)?)$`, 'i');
        const clientswithSlug = await this.constructor.find({ slug: slugRegEx });
        if (clientswithSlug.length) {
                this.clientSlug = `${this.clientSlug}-${clientswithSlug.length + 1}`;
        }
        next();
});

module.exports = mongoose.model('Client', clientSchema);
