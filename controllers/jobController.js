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
        const reps = await Rep.find();
        const clients = await Client.find();
        res.render('editJob', { clients, reps, title: 'Create Mailing' });
};

exports.createJob = async (req, res) => {
        console.log(req.body);
        const job = await new Job(req.body).save();
        req.flash('success', `Successfully Created ${job.jobName}.`);
        res.redirect(`/job/${job.slug}`);
};

exports.getJobBySlug = async (req, res, next) => {
        const job = await Job.findOne({ slug: req.params.slug });
        console.log(req.params);
        if (!job) return next();
        res.render('job', { job, title: job.jobName });
};
