const mongoose = require('mongoose');

const Job = mongoose.model('Job');
const Skid = mongoose.model('Skid');

const helpers = require('../helpers');

exports.jobShipping = async (req, res, next) => {
        const job = await Job.findOne({ jobSlug: req.params.slug });
        const skids = await Skid.find({ skidJob: job._id }).sort({ skidDate: 'desc' });
        const jobPackages = job.packages.map(p =>  (p.packageName, p.packageQuantity));
        
        console.log('jobPackages');
        console.table(jobPackages);
        res.render('jobSkids', { job, skids, title: `${job.jobName} Shipping` });
};

exports.addSkid = async (req, res, next) => {
        const job = await Job.findOne({ _id: req.params.id });
        res.render('editSkid', { job, title: `Create a skid for ${job.jobName}` });
};

exports.createSkid = async (req, res, next) => {
        console.table(req.body);
        const skid = await new Skid(req.body).save();
        const job = await Job.findOne({ _id: req.body.skidJob });
        const p = job.packages.filter(p => p._id === req.body.skidPacakge);
        req.flash('success', `🚚 Shipping out ${skid.skidCount} pieces of ${job.jobName}.`);
        res.redirect(`/shipping/${job.jobSlug}`);
};
exports.editSkid = async (req, res, next) => {
        const skid = await Skid.findOne({ _id: req.params.id });
        const job = await Job.findOne({ _id: skid.skidJob });
        res.render('editSkid', { job, skid, title: `Update skid for ${job.jobName}` });
};

exports.updateSkid = async (req, res, next) => {
        const skid = await Skid.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
        }).exec();
        const job = await Job.findById(skid.skidJob);
        req.flash('success', `Successfully updated skid for ${job.jobName}.`);
        res.redirect(`/shipping/${job.jobSlug}`);
};

exports.deleteSkid = async (req, res, next) => {
        const job = await Job.findOne({ jobSlug: req.params.slug });
        const skid = await Skid.findByIdAndDelete(req.params.id);
        if(!job || !skid) {return next;}
        req.flash('success', `Successfully deleted skid from ${job.jobName}.`);
        res.redirect(`/shipping/${job.jobSlug}`);
};

exports.daysShipping = async (req, res, next) => {
        // get date and subtract a day to account for UTC time 
        const today = helpers.moment().startOf('day').subtract(1,"days").toISOString();
        const tomorrow = helpers.moment(today).startOf('day').add(1,"days").toISOString();
        const skids = await Skid.find( {"skidShipDate": {"$gte": today, "$lte": tomorrow}} ).populate("skidJob"); 
        res.render('shipping', {skids, title: `Shipping out ${helpers.moment(req.params.date).format("YYYY-MM-DD")}`});
};