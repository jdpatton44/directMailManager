const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');
const moment = require('moment')

const truckSchema = new mongoose.Schema ({
    truckCreatedDate: {
        type: Date,
        default: Date.now,
    },
    truckSkids:{ 
        type: [Skid],
    }

})