const mongoose = require('mongoose');

const Rate = mongoose.model('Rate');
const Client = mongoose.model('Client');

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
