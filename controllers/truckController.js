const mongoose = require('mongoose');
const _ = require('lodash');
const Job = mongoose.model('Job');
const Skid = mongoose.model('Skid');


exports.createTruck = (req, res, next) => {
    const skids = Skid.find( { 'shipped': false });
    const jobSkids = _.groupBy(skids, 'skidJob');
    res.render('createTruck', {jobSkids, title: 'Loading Truck...'})
}