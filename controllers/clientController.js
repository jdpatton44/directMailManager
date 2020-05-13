const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const Agency = mongoose.model('Agency');

exports.clientList = async (req, res) => {
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all clients
        const clientsPromise = Client.find()
                .sort({ clientName: 'asc' })
                .skip(skip)
                .limit(limit);
        const countPromise = Client.count();
        const [clients, count] = await Promise.all([clientsPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!clients.length && skip) {
                req.flash('info', `Hey You asked for page ${page}. But that doesn't exist.  Here is page ${pages}`);
                res.redirect(`/clients/page/${pages}`);
        }
        res.render('clientList', { clients, pages, page, title: 'Clients' });
};

exports.addClient = async (req, res) => {
        const agencies = await Agency.find().sort({ agencyName: 'desc' });
        res.render('editClient', { agencies, title: 'Add New Client' });
};

exports.createClient = async (req, res) => {
        const client = await new Client(req.body).save();
        req.flash('success', `Successfully Created ${client.clientName}.`);
        res.redirect(`/client/${client.clientSlug}`);
};

exports.getClientBySlug = async (req, res, next) => {
        const client = await Client.findOne({ clientSlug: req.params.clientSlug });
        if (!client) return next();
        res.render('client', { client, title: client.ClientName });
};
