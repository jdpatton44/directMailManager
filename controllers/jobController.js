const mongoose = require('mongoose');

const Job = mongoose.model('Job');
const Client = mongoose.model('Client');
const Rep = mongoose.model('Rep');

exports.jobList = async (req, res) => {
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all jobs
        const jobsPromise = Job.find()
                .skip(skip)
                .limit(limit)
                .populate('jobClient jobRep')
                .sort({ jobMailDate: 'desc' });
        const countPromise = Job.count();
        const [jobs, count] = await Promise.all([jobsPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!jobs.length && skip) {
                req.flash('info', `Hey You asked for page ${page}. But that doesn't exist.  Here is page ${pages}`);
                res.redirect(`/jobs/page/${pages}`);
        }
        res.render('jobList', { jobs, pages, page, title: 'Current Mailings' });
};

exports.addJob = async (req, res) => {
        console.log(req.body);
        const reps = await Rep.find().sort({ repName: ''});
        const clients = await Client.find().sort({jobName: ''});
        res.render('editJob', { clients, reps, title: 'Create Mailing' });
};

exports.createJob = async (req, res) => {
        console.log(req.body);
        const job = await new Job(req.body).save();
        req.flash('success', `Successfully Created ${job.jobName}.`);
        res.redirect(`/job/${job.slug}`);
};

exports.getJobBySlug = async (req, res, next) => {
        const job = await Job.findOne({ slug: req.params.jobSlug });
        console.log(req.params);
        if (!job) return next();
        res.render('job', { job, title: job.jobName });
};

exports.editJob = async (req, res, next) => {
        const job = await Job.findOne({ _id: req.params.id });
        const clients = await Client.find().sort({ clientName: 'asc' });
        const reps = await Rep.find().sort({ repName: 'asc' });
        res.render('editJob', { title: `Edit ${job.jobName}`, job, clients, reps });
};

exports.updateJob = async (req, res, next) => {
        const job = await Job.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
        }).exec();
        req.flash(
                'success',
                `Successfully updated <strong>${job.jobName}</strong>. <a href="/jobs/${job.slug}">View Job -<</a>`
        );
        res.redirect(`/jobs/${job._id}/edit`);
};


exports.jobsByClient = async (req, res) => {
        const clientSlug = req.params.clientSlug;
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all jobs
        const client = await Client.findOne({ clientSlug : clientSlug } );
        console.log(client.clientName, client._id);
        const jobsPromise = Job.find({ jobClient : client._id } )
                .skip(skip)
                .limit(limit)
                .populate('jobClient jobRep')
                .sort({ jobMailDate: 'desc' });
        const countPromise = Job.count();
        const [jobs, count] = await Promise.all([jobsPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!jobs.length && skip) {
                req.flash('info', `Hey You asked for page ${page}. But that doesn't exist.  Here is page ${pages}`);
                res.redirect(`/jobs/page/${pages}`);
        }
        res.render('jobList', { jobs, pages, page, title: `Mailings for ${client}` });
};