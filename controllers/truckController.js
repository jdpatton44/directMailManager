const mongoose = require('mongoose');
const _ = require('lodash');
const helpers = require('../helpers');

const Job = mongoose.model('Job');
const Skid = mongoose.model('Skid');
const Truck = mongoose.model('Truck');

exports.viewTruck = async (req, res, next) => {
  // find the truck using the params from the url
  const truck = await Truck.findOne({ _id: req.params.id });
  // find the skids using the list of skids in the truck object then group them by job
  const skids = await Skid.find({ _id: { $in: truck.truckSkids.map(s => mongoose.Types.ObjectId(s)) } });
  const skidsByGroup = _.groupBy(skids, 'skidJob')
  // get a list of jobs from the skids on the truck and find those jobs
  const jobSkids = skids.map(skid => skid.skidJob);
  const jobs = await Job.find({ _id: { $in: jobSkids.map(j => mongoose.Types.ObjectId(j)) } });

  res.render('viewTruck', { truck, jobs, skids, skidsByGroup, title: 'View Truck' });
};

exports.truckList = async (req, res, next) => {
  // get all trucks, sort by created date, descending
  const trucks = await Truck.find().sort({truckCreatedDate: 'desc'})
  res.render('truckList', {trucks, title: 'Trucks'})
}

exports.newTruck = async (req, res, next) => {
  // get all the skids that have not been shipped yet
  const skids = await Skid.find({ shipped: false });
  // group them by job
  const jobSkids = _.groupBy(skids, 'skidJob');
  const jobIds = Object.keys(jobSkids);
  // get all the jobs that have skids that have not been shipped yet
  const jobs = await Job.find({ _id: { $in: jobIds.map(j => mongoose.Types.ObjectId(j)) } });
  res.render('createTruck', { jobSkids, skids, jobs, title: 'Loading Truck...' });
};

exports.addTruck = async (req, res, next) => {
  let numSkids = 0;
  // if only 1 skid is on the truck trcukSkids comes as the _id in a string
  if(!req.body.truckSkids) {
    req.flash('error', `There were no skids selected for the truck. Cannot create truck without skids.`);
    res.redirect(`/truck/viewTrucks/truckList`);
  }
  // Create Truck
  const truck = await new Truck(req.body);
  truck.save()
  // if there is only 1 skid update it
  if (typeof(req.body.truckSkids) === 'string') { 
    const truckskids = await Skid.findByIdAndUpdate(req.body.truckSkids, {shipped: true, skidTruckDate: helpers.moment(),skidTruck: truck._id } );
  }
  // if there are multiple skids truckSkids is an array
  else {
    const truckSkids = req.body.truckSkids.map(s => mongoose.Types.ObjectId(s));
    // Update skids to shipped
    const skids = await Skid.updateMany(
      { _id: { $in: truckSkids } },
      { shipped: true, skidTruckDate: helpers.moment(),skidTruck: truck._id }
    );
    numSkids = truckSkids.length 
  }
  req.flash('success', `Successfully loaded a truck with ${numSkids < 2 ? '1 Skid' : numSkids + ' skids'}.`);
  res.redirect(`/truck/viewTrucks/truckList`);
};

// exports.editTruck = async (req, res, next) => {
//     const truck = await Truck.findOne( { _id: req.params.id });
//     res.render('updateTruck', { truck, title: 'Edit Truck'});
// };

// exports.updateTruck = async (req, res, next) => {

//     req.flash('success', `Successfully updated truck.`);
//     res.redirect(`/truck/${truck._id}`);
// };
