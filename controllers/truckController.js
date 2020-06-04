const mongoose = require('mongoose');
const _ = require('lodash');
const Job = mongoose.model('Job');
const Skid = mongoose.model('Skid');


exports.viewTruck = async (req, res, next) => {
    const truck = await Truck.findOne( {_id: req.params.id });
    res.render('viewTruck', {truck, title: "View Truck"});
};

exports.createTruck = async (req, res, next) => {
    const skids = await Skid.find( { 'shipped': false });
    const jobSkids = _.groupBy(skids, 'skidJob');
    res.render('createTruck', {jobSkids, title: 'Loading Truck...'});
};

exports.addTruck = async (req, res, next) => {
    const truck = await new Truck(req.body).save();
    req.flash('success', `Successfully loaded a truck with ${truck.truckSkids.length}.`);
    res.redirect(`/truck/${truck._id}`);
};

exports.editTruck = async (req, res, next) => {
    const truck = await Truck.findOne( { _id: req.params.id });
    res.render('updateTruck', { truck, title: 'Edit Truck'});
};

exports.updateTruck = async (req, res, next) => {
    
    
    req.flash('success', `Successfully updated truck.`);
    res.redirect(`/truck/${truck._id}`);
};




router.get('/truck/:id', catchErrors(truckController.viewTruck))
router.get('/truck/createTruck', catchErrors(truckController.createTruck))
router.post('/truck/createTruck', catchErrors(truckController.addTruck))
router.get('/truck/editTruck/:id', catchErrors(truckController.editTruck))
router.post('/truck/updateTruck/:id', catchErrors(truckController.updateTruck))