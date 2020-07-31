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

  res.render('trucks/viewTruck', { truck, jobs, skids, skidsByGroup, title: 'View Truck' });
};

exports.truckList = async (req, res, next) => {
  // get all trucks, sort by created date, descending
  const trucks = await Truck.find().sort({truckCreatedDate: 'desc'})
  res.render('trucks/truckList', {trucks, title: 'Trucks'})
}

exports.newTruck = async (req, res, next) => {
  // get all the skids that have not been shipped yet
  const skids = await Skid.find({ shipped: false });
  // group them by job
  const jobSkids = _.groupBy(skids, 'skidJob');
  const jobIds = Object.keys(jobSkids);
  // get all the jobs that have skids that have not been shipped yet
  const jobs = await Job.find({ _id: { $in: jobIds.map(j => mongoose.Types.ObjectId(j)) } });
  res.render('trucks/createTruck', { jobSkids, skids, jobs, title: 'Loading Truck...' });
};

exports.addTruck = async (req, res, next) => {
  let numSkids = 0;
  // if only 1 skid is on the truck trcukSkids comes as the _id in a string
  if(!req.body.truckSkids || req.body.truckSkids === []) {
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

// unload truck view
exports.unloadTruck = async (req, res, next) => {
  const truck = await Truck.findOne( {_id: req.params.id} );
  const skids = await Skid.find( {skidTruck: truck._id} );
  const skidJobs = skids.map(s => s.skidJob)
  const jobs = await Job.find( { '_id': { $in: skidJobs} });
  res.render('trucks/unloadingView', {skids, jobs, truck})
  // req.flash('success', `Successfully unloaded ${SKIDS} from truck ${truck.id}.`);
  // res.redirect(`/truck/viewTrucks/truckList`);
};

// unload skids and redirect
exports.removeSkid = async (req, res) => {
  const truck = await Truck.findOne({ _id: req.params.truckId });
  // if the request is to remove all skids, do this
  if(req.params.skidId === 'all') {
    const skids = truck.truckSkids;
    const updatedTruck = await Truck.findOneAndUpdate( {_id: truck._id}, { truckSkids: [] } );
    const updatedSkids = await Skid.updateMany( { _id: {$in: skids}}, {"$set":{ shipped: false, skidTruck: null, skidTruckDate: null }}, {"multi": true}, (error) => {});
    res.redirect(`/truck/viewTruck/${truck._id}`);
  }
  // do this for only 1 skid.
  const skid = await Skid.findOneAndUpdate({ _id: req.params.skidId }, { shipped: false, skidTruck: null, skidTruckDate: null });
  const updatedTruck = await Truck.findOneAndUpdate( {_id: truck._id}, { $pullAll: { truckSkids: [skid._id] }  } );
  res.redirect(`/truck/unload/${updatedTruck._id}`);
};

// delete a truck
exports.deleteTruck = async (req, res, next) => {
  const truck = await Truck.findById(req.params.id);
  console.log('Truck: ',truck)
  // check to see if truck has any skids on it
  if (truck.truckSkids[0]) {
    req.flash('error', `This truck still has skids on it.  Please unload the truck to delete it.`);
    res.redirect(`/truck/viewTrucks/truckList`);
  } else {
    const truckToDelete = await Job.findOneAndDelete( {_id: req.params.id}, {truckSkids: []}, function (err, docs) { 
      if (err){ 
          console.log('Error: ', err) 
      } 
      else{ 
          console.log("Deleted : ", docs); 
      } 
    });
    console.log('second truck');
    req.flash('success', `Successfully deleted truck ${truckToDelete.id}.`);
    res.redirect(`/truck/viewTrucks/truckList`);
  }
  
};

