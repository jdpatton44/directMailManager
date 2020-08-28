/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
const moment = require('moment');
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);

// inserting an SVG
exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `Direct Mail Manager`;

// Get Monday of the week
exports.getMonday = d => {
        const inputDate = new Date(d);
        const day = inputDate.getDay();
        const diff = inputDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(inputDate.setDate(diff));
};

// Format Money
exports.formatCurrency = n =>
        new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
        }).format(n);

// Mailing options for dropdown
exports.mailingOptions = [
        'Straight 1st',
        '1st Presort',
        'Standard Rate',
        'SCF',
        'Non Profit',
        'Midwest Commingle',
        'PSI Commingle',
        'Foriegn',
];

// Postage options for dropdown
exports.postageOptions = [
        'NP Indicia',
        'NP Stamp',
        'NP Meter',
        'Standard Stamp',
        'Standard Meter',
        'Standard Indicia',
        '1st Class Stamp',
        'Foriegn',
];

// Format phone numbers
exports.formatPhoneNumber = str => {
        // Filter only numbers from the input
        const cleaned = `${str}`.replace(/\D/g, '');
        // Check if the input is of correct length
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
                return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return null;
};

const today = moment(new Date()).format('YYYY-MM-DD');

// Create the items in the nav bar 
exports.menu = [
        { slug: '/jobCalendar', title: 'Calendar', icon: 'calendar'},
        { slug: '/jobList', title: 'All Jobs', icon: 'mailbox' },
        { slug: '/addJob', title: 'Add Job', icon: 'newJob' },
        { slug: '/clientList', title: 'Clients', icon: 'client' },
        { slug: '/addClient', title: 'Add Client', icon: 'addClient' },
        { slug: '/repList', title: 'Reps', icon: 'reps' },
        { slug: '/addRep', title: 'Add Rep', icon: 'addRep' },
        { slug: '/agencyList', title: 'Agencies', icon: 'agency' },
        { slug: '/addAgency', title: 'Add Agency', icon: 'addAgency' },
        { slug: `/truck/viewTrucks/truckList`, title: 'Shipping', icon: 'truck'},
        { slug: '/rateList', title: 'Rates', icon: 'rate' },
];
