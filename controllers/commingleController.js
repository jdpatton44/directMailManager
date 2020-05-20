const mongoose = require('mongoose');

const Rate = mongoose.model('Rate');
const Client = mongoose.model('Client');
const Agency = mongoose.model('Agency');
const Rep = mongoose.model('Rep');
const Job = mongoose.model('Job');

function updatePackages(p, rates) {
    const midWestNpRate = rates.find(r => r.rateName === 'Midwest NonProfit');
    console.log(midWestNpRate)
    const midWestStdRate = rates.find(r => r.rateName === 'Midwest Standard');
    console.log(midWestStdRate)
    const midWestStdRate = rates.find(r => r.rateName === 'Midwest Standard');

    if(p.mailingMethod === 'Midwest Commingle' || 'SCF') {
        p.commingleQuantity = p.packageQuantity;
        p.packagePickupDate = p.packageMaildate;
        // switch (p.packagePostage) {
        //     case 'NP Meter':
        //         p.comminglePostageDue = ( midWestNP - npMeter ) * p.commingleQuantity;
        //         //console.log(p.comminglePostageDue, midWestNP, npMeter, p.commingleQuantity)
        //         break;
        //     case 'NP Indicia':
        //         p.comminglePostageDue = ( midWestNP ) * p.commingleQuantity;
        //         //console.log(p.comminglePostageDue)
        //         break;
        //     case 'NP Stamp':
        //         p.comminglePostageDue = ( midWestNP - npStamp ) * p.commingleQuantity;
        //         //console.log(p.comminglePostageDue)
        //         break;
        //     case 'Standard Stamp':
        //         p.comminglePostageDue = ( midWestStd - stdStamp ) * p.commingleQuantity;
        //         break;
        //     case 'Standard Meter':
        //         p.comminglePostageDue = ( midWestStd - stdMeter ) * p.commingleQuantity;
        //         break;
        //     case 'Standard Indicia':
        //         p.comminglePostageDue = ( midWestStd ) * p.commingleQuantity;
        //         break;
        //     default:
        //         console.log('Invalid Postage Type');
        // }
        
    }
}

exports.createCommingleSheet = async (req, res, next) => {
    const job = await Job.findOne( { jobSlug: req.params.slug } ) //.populate('jobClient');
    const rates = await Rate.find();
    job.packages.forEach(p => updatePackages(p, rates));
    res.render('commingleSheet', {job, title: `${job.jobName} Commingle`});   
}