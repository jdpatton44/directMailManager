const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const Agency = mongoose.model('Agency');
const Job = mongoose.model('Job');

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
        const agency = await Agency.findOne({ _id: client.clientAgency});
        if (!client) return next();
        const clientJobs = await Job.find({ jobClient: client._id }).populate('jobClient jobRep');
        res.render('client', { client, agency, clientJobs, title: client.clientName });
};

exports.editClient = async (req, res, next) => {
        const client = await Client.findOne({ _id: req.params.id });
        if (!client) return next();
        const agencies = await Agency.find().sort({ agencyName: 'asc' });
        res.render('editClient', { agencies, client, title: `Edit ${client.clientName}` });
};

exports.updateClient = async (req, res, next) => {
        const client = await Client.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
        }).exec();
        req.flash(
                'success',
                `Successfully updated <strong>${client.clientName}</strong>.`
        );
        res.redirect(`/client/${client.clientSlug}`);
};
