const mongoose = require('mongoose');

const Rate = mongoose.model('Rate');
const Client = mongoose.model('Client');
const Agency = mongoose.model('Agency');
const Rep = mongoose.model('Rep');
const Job = mongoose.model('Job');

const helpers = require('../helpers');

function updatePackages(p, rates) {
        // check to make sure there is a commingle portion
        if (p.mailingMethod === 'Midwest Commingle' || 'SCF') {
                // get rates for calculation
                const midWestNpRate = rates.find(r => r.rateName === 'Midwest NonProfit').rateAmount;
                const midWestStdRate = rates.find(r => r.rateName === 'Midwest Standard').rateAmount;
                const stdStamp = rates.find(r => r.rateName === 'Standard Stamp').rateAmount;
                const stdMeter = rates.find(r => r.rateName === 'Standard Meter').rateAmount;
                const npStamp = rates.find(r => r.rateName === 'NP Stamp').rateAmount;
                const npMeter = rates.find(r => r.rateName === 'NP Meter').rateAmount;
                // set the quantity to the package quantity (this will only be updated for SCF) and the pickup data to the mail date
                if (!p.commingleQuantity) {
                        p.commingleQuantity = p.packageQuantity;
                }
                if (!p.packagePickupDate) {
                        p.packagePickupDate = p.packageMaildate;
                }
                switch (p.packagePostage) {
                        case 'NP Meter':
                                p.comminglePostageDue = (midWestNpRate - npMeter) * p.commingleQuantity;
                                // console.log(p.comminglePostageDue, midWestNpRate, npMeter, p.commingleQuantity);
                                break;
                        case 'NP Indicia':
                                p.comminglePostageDue = midWestNpRate * p.commingleQuantity;
                                // console.log(p.comminglePostageDue)
                                break;
                        case 'NP Stamp':
                                p.comminglePostageDue = (midWestNpRate - npStamp) * p.commingleQuantity;
                                // console.log(p.comminglePostageDue)
                                break;
                        case 'Standard Stamp':
                                p.comminglePostageDue = (midWestStdRate - stdStamp) * p.commingleQuantity;
                                break;
                        case 'Standard Meter':
                                p.comminglePostageDue = (midWestStdRate - stdMeter) * p.commingleQuantity;
                                break;
                        case 'Standard Indicia':
                                p.comminglePostageDue = midWestStdRate * p.commingleQuantity;
                                break;
                        default:
                                console.log('Invalid Postage Type');
                }
        }
}

exports.createCommingleSheet = async (req, res, next) => {
        const job = await Job.findOne({ jobSlug: req.params.slug });
        if (!job) return next();
        const rates = await Rate.find();
        if (!rates) return next();
        job.packages.forEach(p => updatePackages(p, rates));
        job.save();
        res.render('commingleSheet', { job, title: `${job.jobName} Commingle` });
};

exports.updateCommingleSheet = async (req, res, next) => {
        const rates = await Rate.find();
        if (!rates) return next();
        const updatedPackages = [];
        console.log(req.body);
        let p = {};
        for (let i = 0; i < req.body._id.length; i++) {
                p = {
                        packagePostage: req.body.packagePostage[i],
                        packagePickupDate: req.body.packagePickupDate[i],
                        commingleQuantity: req.body.commingleQuantity[i],
                        comminglePostageDue: req.body.comminglePostageDue[i],
                        _id: req.body._id[i],
                };
                updatePackages(p, rates);
                updatedPackages.push(p);
        }
        console.log(updatedPackages);
        updatedPackages.forEach(p => {
                Job.findOneAndUpdate(
                        { _id: req.params.id, 'packages._id': p._id },
                        {
                                $set: {
                                        'packages.$.commingleQuantity': p.commingleQuantity,
                                        'packages.$.comminglePostageDue': parseFloat(p.comminglePostageDue),
                                        'packages.$.packagePickupDate': helpers
                                                .moment(p.packagePickupDate)
                                                .format('MM-DD-YYYY'),
                                },
                        },
                        function(err, doc) {
                                if (err) {
                                        console.log(err);
                                }
                                console.log('doc: ', doc);
                        }
                );
        });
        const job = await Job.findOne({ _id: req.params.id });
        console.log(job.packages);
        req.flash('success', `Successfully updated commingle information for ${job.jobName}.`);
        res.render('commingleSheet', { job, title: `${job.jobName} Commingle` });
};
