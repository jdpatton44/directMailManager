/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
exports.staticMap = ([lng, lat]) =>
        `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${
                process.env.MAP_KEY
        }&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `Direct Mail Manager`;

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

exports.menu = [
        { slug: '/jobList', title: 'Current Jobs', icon: 'mailbox' },
        { slug: '/addJob', title: 'Add Job', icon: 'newJob' },
        { slug: '/clientList', title: 'Clients', icon: 'client' },
        { slug: '/addClient', title: 'Add Client', icon: 'add' },
        { slug: '/repList', title: 'Reps', icon: 'reps' },
        { slug: '/addRep', title: 'Add Rep', icon: 'addRep' },
        { slug: '/agencyList', title: 'Agencies', icon: 'agency' },
        { slug: '/addAgency', title: 'Add Agency', icon: 'add' },
];
