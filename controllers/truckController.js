const mongoose = require('mongoose');
const _ = require('lodash');

const Job = mongoose.model('Job');
const Skid = mongoose.model('Skid');
const Truck = mongoose.model('Truck');

exports.viewTruck = async (req, res, next) => {
  const truck = await Truck.findOne({ _id: req.params.id });
  const skids = await Skid.find({ _id: { $in: truck.truckSkids.map(s => mongoose.Types.ObjectId(s)) } });
  const jobSkids = skids.map(skid => skid.skidJob);
  const jobs = await Job.find({ _id: { $in: jobSkids.map(j => mongoose.Types.ObjectId(j)) } });
  res.render('viewTruck', { truck, jobs, skids, title: 'View Truck' });
};

exports.newTruck = async (req, res, next) => {
  const skids = await Skid.find({ shipped: false });
  const jobSkids = _.groupBy(skids, 'skidJob');
  const jobIds = Object.keys(jobSkids);
  const jobs = await Job.find({ _id: { $in: jobIds.map(j => mongoose.Types.ObjectId(j)) } });
  const truckData = 'ok';
  res.render('createTruck', { jobSkids, skids, jobs, title: 'Loading Truck...' });
};

exports.addTruck = async (req, res, next) => {
  // const truckData = [req.body.truckSkids];
  // console.log(truckData);
  const truckSkids = req.body.truckSkids.map(s => mongoose.Types.ObjectId(s));
  // Update skids to shipped
  const skids = await Skid.updateMany(
    { _id: { $in: truckSkids } },
    { shipped: true }
  );
  console.log(truckSkids);
  console.log(skids);
  // Create Truck
  const truck = await new Truck(req.body).save();
  req.flash('success', `Successfully loaded a truck with ${truckSkids.length < 2 ? '1 Skid' : truckSkids.length + ' skids'}.`);
  res.redirect(`/truck/viewTruck/${truck._id}`);
};

// exports.editTruck = async (req, res, next) => {
//     const truck = await Truck.findOne( { _id: req.params.id });
//     res.render('updateTruck', { truck, title: 'Edit Truck'});
// };

// exports.updateTruck = async (req, res, next) => {

//     req.flash('success', `Successfully updated truck.`);
//     res.redirect(`/truck/${truck._id}`);
// };
