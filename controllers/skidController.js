const mongoose = require('mongoose');
const _ = require('lodash');

const Job = mongoose.model('Job');
const Skid = mongoose.model('Skid');

const helpers = require('../helpers');

exports.jobShipping = async (req, res, next) => {
  const job = await Job.findOne({ jobSlug: req.params.slug });
  const skids = await Skid.find({ skidJob: job._id }).sort({ skidDate: 'desc' });
  const jobPackages = job.packages.map(p => (p.packageName, p.packageQuantity));

  console.log('jobPackages');
  console.table(jobPackages);
  res.render('jobSkids', { job, skids, title: `${job.jobName} Shipping` });
};

exports.addSkid = async (req, res, next) => {
  const job = await Job.findOne({ _id: req.params.id });
  const { count } = req.params;
  res.render('editSkid', { job, count, title: `Create a skid for ${job.jobName}` });
};

exports.createSkid = async (req, res, next) => {
  const skid = await new Skid(req.body).save();
  const job = await Job.findOne({ _id: req.body.skidJob });
  const p = job.packages.filter(p => p._id === req.body.skidPacakge);
  req.flash('success', `Skid ${skid.skidNumber} with ${skid.skidCount} pieces for ${job.jobName} created.`);
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
  if (!job || !skid) {
    return next;
  }
  req.flash('success', `Successfully deleted skid from ${job.jobName}.`);
  res.redirect(`/shipping/${job.jobSlug}`);
};

exports.daysShipping = async (req, res, next) => {
  // get date and subtract a day to account for UTC tinpmme
  let date;
  if (req.body.shippingDate) {
    date = helpers.moment(req.body.shippingDate).utc(); // .add(1,"days");
  } else {
    date = helpers
      .moment(new Date())
      .startOf('day')
      .utc();
  }
  let shipDate = helpers
    .moment(date)
    .startOf('day')
    .toISOString();
  const tomorrow = helpers
    .moment(shipDate)
    .startOf('day')
    .utc()
    .toISOString();
  const skids = await Skid.find({ skidShipDate: { $gte: shipDate, $lte: tomorrow } }).populate('skidJob');
  shipDate = helpers.moment(shipDate).utc();
  const packageSkids = _.groupBy(skids, 'skidPackage');
  const ps = Object.keys(packageSkids);
  res.render('trucks/shipping', {
    ps,
    packageSkids,
    skids,
    shipDate,
    title: `Shipping out ${helpers.moment(shipDate).format('YYYY-MM-DD')}`,
  });
};
