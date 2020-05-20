const mongoose = require('mongoose');

const Rate = mongoose.model('Rate');
const Client = mongoose.model('Client');
const Agency = mongoose.model('Agency');
const Rep = mongoose.model('Rep');

exports.rateList = async (req, res) => {
        const rates = await Rate.find().sort({ rateName: 'desc' });
        const clients = await Client.find().sort({ clientName: 'desc' });
        res.render('rateList', { rates, clients, title: 'Postage Rates' });
};

exports.addRate = (req, res) => {
        res.render('editRate', { title: 'Add a new rate' });
};

exports.createRate = async (req, res) => {
        const rate = await new Rate(req.body).save();
        req.flash('success', `Succesfully create ${rate.rateName}`);
        res.redirect('../rateList');
};

exports.editRate = async (req, res, next) => {
        const rate = await Rate.findOne({ _id: req.params.id });
        if (!rate) return next();
        res.render('editRate', { rate, title: `Edit ${rate.rateName}` });
};

exports.updateRate = async (req, res, next) => {
        console.log(req.body);
        const rate = await await Rate.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                {
                        new: true,
                        runValidators: true,
                },
                function(err, result) {
                        if (err) {
                                console.log(err);
                        } else {
                                return result;
                        }
                }
        );
        req.flash('success', `Succesfully updated ${rate.rateName}`);
        res.redirect('/rateList');
};

exports.editClientRate = async (req, res, next) => {
        const client = await Client.findOne( { clientSlug: req.params.slug} );
        res.render('editClientRate', {client, title: `Update Rate for ${client.clientName}`} )
}

exports.updateClientRate = async (req, res, next) => {
        const client = await Client.findOneAndUpdate({ _id: req.params.id }, { $set: { clientCommingleRate: req.body.rateAmount } }, {
                new: true,
                runValidators: true,
        });
        req.flash(
                'success',
                `Successfully updated <strong>${client.clientName}</strong> commingle rate to ${
                        client.clientCommingleRate
                }`
        );
        res.redirect(`/rateList`);
};

exports.editAgencyRate = async (req, res, next) => {
        const agencies = await Agency.find();
        res.render('agencyRateUpdate', { agencies, title: `Update Rates` });
};

exports.updateAgencyRate = async (req, res, next) => {
        const agency = await Agency.findOne({ _id: req.body.agencyId });
        const clients = await Client.updateMany(
                {
                        clientAgency: req.body.agencyId,
                },
                { $set: { clientCommingleRate: req.body.rateAmount } }
        );
        req.flash(
                'success',
                `Successfully updated ${clients.nModified} of ${agency.agencyName} clients' commingle rate to ${req.body.rateAmount}`
        );
        res.redirect(`/rateList`);
};