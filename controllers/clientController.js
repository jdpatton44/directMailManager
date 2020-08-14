const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const Agency = mongoose.model('Agency');
const Job = mongoose.model('Job');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
        storage: multer.memoryStorage(),
        fileFilter(req, file, next) {
                const isPhoto = file.mimetype.startsWith('image/');
                if (isPhoto) {
                        next(null, true);
                } else {
                        next({ message: "That filetype isn't allowed!" }, false);
                }
        },
};

// upload file middleware
exports.upload = multer(multerOptions).single('photo');
// resize file middleware
exports.resize = async (req, res, next) => {
        // console.log('starting resize');
        console.log(req.body.file);
        // check if new file to resize
        if (!req.file) {
                next(); // skip to next middleware
                return;
        }
        const extension = req.file.mimetype.split('/')[1];
        req.body.photo = `${uuid.v4()}.${extension}`;
        console.log(req.body.photo);
        // no we resize
        const photo = await jimp.read(req.file.buffer);
        console.log('resized');
        await photo.resize(800, jimp.AUTO);
        await photo.write(`./public/uploads/${req.body.photo}`);
        console.log('written to file system');
        // once the photo has been written to file system continue
        next();
};

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
        const type = 'clientList'
        res.render('clients/clientList', { clients, pages, page, count, type, title: 'Clients' });
};

exports.addClient = async (req, res) => {
        const agencies = await Agency.find().sort({ agencyName: 'desc' });
        res.render('clients/editClient', { agencies, title: 'Add New Client' });
};

exports.createClient = async (req, res) => {
        const client = await new Client(req.body).save();
        req.flash('success', `Successfully Created ${client.clientName}.`);
        res.redirect(`/client/${client.clientSlug}`);
};

exports.getClientBySlug = async (req, res, next) => {
        const client = await Client.findOne({ clientSlug: req.params.clientSlug });
        const agency = await Agency.findOne({ _id: client.clientAgency });
        if (!client) return next();
        const clientJobs = await Job.find({ jobClient: client._id }).sort({jobMailDate: 'desc',}).populate('jobClient jobRep');
        res.render('clients/client', { client, agency, clientJobs, title: client.clientName });
};

exports.editClient = async (req, res, next) => {
        const client = await Client.findOne({ _id: req.params.id });
        if (!client) return next();
        const agencies = await Agency.find().sort({ agencyName: 'asc' });
        res.render('clients/editClient', { agencies, client, title: `Edit ${client.clientName}` });
};

exports.updateClient = async (req, res, next) => {
        console.log(req.body);
        const client = await Client.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
        }).exec();
        req.flash('success', `Successfully updated <strong>${client.clientName}</strong>.`);
        res.redirect(`/client/${client.clientSlug}`);
};
