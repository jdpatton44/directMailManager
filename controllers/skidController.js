const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const Job = mongoose.model('Job');

const helpers = require('../helpers');

exports.jobShipping = async (req, res, next) => {
    const job = await Job.findOne({ jobSlug: req.params.slug });
    const skids = await skids.find( {skidJob: job._id});
    res.render('jobSkids', {job, skids, title: `${job.jobName} Shipping`})
};

exports.addSkid = async (req, res, next) => {
    const job = await Job.findOne( { _id: req.params.id });
    res.render('addSkid', {job, title: `Create a skid for ${job.JobName}`});
};

exports.createSkid = async (req, res, next) => {
    const skid = await new Skid(req.body).save();
    const job = await Job( {_id: skid.skidJob } );
    req.flash('success', `🚚 Shipping out ${skid.skidCount} pieces of ${job.jobName}.`);
        res.redirect(`/shipping/${job.jobSlug}`);
};
exports.editSkid = async (req, res, next) => {

};

exports.updateSkid = async (req, res, next) => {

};

exports.deleteSkid = async (req, res, next) => {
    
};
