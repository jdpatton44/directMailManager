const mongoose = require('mongoose');

const Rate = mongoose.model('Rate');
const Client = mongoose.model('Client');
const Agency = mongoose.model('Agency');
const Rep = mongoose.model('Rep');
const Job = mongoose.model('Job');

function updatePackages(p, rates) {
        // stop if the quantity has already been calculated
        if (p.commingleQuantity) {
                return;
        }
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
                p.commingleQuantity = p.packageQuantity;
                p.packagePickupDate = p.packageMaildate;
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
        res.render('commingleSheet', { job, title: `${job.jobName} Commingle` });
};

exports.updateCommingleSheet = async (req, res, next) => {
        console.log(req.body);
        const job = await Job.findOne({ jobSlug: req.params.slug });
        console.log(req.params);
        if (!job) return next();
        res.render('job', { job, title: job.jobName });
};
