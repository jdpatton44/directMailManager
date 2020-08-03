/* eslint-disable no-console */
const mongoose = require('mongoose');

const Job = mongoose.model('Job');
const Client = mongoose.model('Client');
const Rep = mongoose.model('Rep');
const Agency = mongoose.model('Agency');

const helpers = require('../helpers');

// list all the jobs in the system
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
        // pagination - get total number of jobs
        const countPromise = Job.count();
        const [jobs, count] = await Promise.all([jobsPromise, countPromise]);
        // calculate number of pages with limit number of jobs per page
        const pages = Math.ceil(count / limit);
        // error if a page number is requested that is not available 
        if (!jobs.length && skip) {
                req.flash('info', `Hey You asked for page ${page}. But that doesn't exist.  Here is page ${pages}`);
                res.redirect(`/jobs/page/${pages}`);
        }
        res.render('jobList', { jobs, pages, page, count, title: 'Current Mailings' });
};

// new job form 
exports.addJob = async (req, res) => {
        // get reps and clients for drop downs
        const reps = await Rep.find().sort({ repName: 'desc' });
        const clients = await Client.find().sort({ clientName: 'desc' });
        res.render('editJob', { clients, reps, title: 'Create Mailing' });
};

// create a new job
exports.createJob = async (req, res) => {

        const job = await new Job(req.body).save();
        console.log(job);
        req.flash('success', `Successfully Created ${job.jobName}.`);
        res.redirect(`/job/${job.jobSlug}`);
};

// page to show the job 
exports.getJobBySlug = async (req, res, next) => {
        const job = await Job.findOne({ jobSlug: req.params.jobSlug });
        if (!job) return next();
        // calculate job quantity be totaling package counts
        let quantity = 0;
        if (job.packages !== []) {
                quantity = job.packages.reduce((t, { packageQuantity }) => t + packageQuantity, 0);
        }
        res.render('job', { job, quantity, title: job.jobName });
};

// get job by id and redirect to job by slug
exports.getJobById = async (req, res, next) => {
        const job = await Job.findById(req.params.id);
        if (!job) return next();
        res.redirect(`/job/${job.jobSlug}`);
}

// edit an existing job
exports.editJob = async (req, res, next) => {
        // get the job to edit
        const job = await Job.findOne({ _id: req.params.id });
        // get all clients for the drop down
        const clients = await Client.find().sort({ clientName: 'asc' });
        // get all reps for the drop down
        const reps = await Rep.find().sort({ repName: 'asc' });
        res.render('editJob', { title: `Edit ${job.jobName}`, job, clients, reps });
};

// process edits and redirect to job page 
exports.updateJob = async (req, res, next) => {
        const job = await Job.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
        }).exec();
        req.flash(
                'success',
                `Successfully updated <strong>${job.jobName}</strong>.</a>`
        );
        res.redirect(`/job/${job.jobSlug}`);
};

// update only the job Notes from the job display page 
exports.updateJobNotes = async (req, res, next) => {
        const job = await Job.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
        }).exec();
        req.flash(
                'success',
                `Successfully add notes to <strong>${job.jobName}</strong>.</a>`
        );
        res.redirect(`/job/${job.jobSlug}`); 
};

// display a list of jobs for a certain client same paganation 
exports.jobsByClient = async (req, res) => {
        const { clientSlug } = req.params;
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all jobs
        const client = await Client.findOne({ clientSlug });
        const jobsPromise = Job.find({ jobClient: client._id })
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

// get a list of jobs for a certain agency
exports.jobsByAgency = async (req, res) => {
        const { agencySlug } = req.params;
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all jobs with reps that are at the agency
        const agency = await Agency.findOne({ agencySlug });
        const reps = await Rep.find({ repAgency: agency._id });
        const repArray = Array.from(reps);
        const repIds = repArray.map(rep => mongoose.Types.ObjectId(rep._id));
        const jobsPromise = Job.find({
                jobRep: { $in: repIds },
        })
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
        res.render('jobList', { repIds, jobs, pages, page, title: `Mailings for ${agency.AgencyName}` });
};

// get a list of jobs for a certain rep
exports.jobsByRep = async (req, res) => {
        const { repSlug } = req.params;
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all jobs
        const rep = await Rep.findOne({ repSlug });
        const jobsPromise = Job.find({ jobRep: rep._id })
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
        res.render('jobList', { jobs, pages, page, title: `Mailings for ${rep.repName}` });
};

// search for a job by job name
exports.searchJobs = async (req, res) => {
        const jobs = await Job
                // find stores that match using index
                .find(
                        {
                                $text: {
                                        $search: req.query.q,
                                },
                        },
                        {
                                score: {
                                        $meta: 'textScore',
                                },
                        }
                )
                // sort the stores using meta data score
                .sort({
                        score: { $meta: 'textScore' },
                })
                // return 5 stores at a time
                .limit(5);
        res.json(jobs);
};

// display current jobs this week, next week, and the past 2 weeks
exports.currentJobs = async (req, res) => {
        // get start date for each section
        const thisMonday = helpers.getMonday(helpers.moment().startOf('day'));
        const nextMonday = helpers.moment(thisMonday).add(7, 'days');
        const mondayBeforeLast = helpers.moment(thisMonday).subtract(14, 'days');
        const mondayAfterNext = helpers.moment(thisMonday).add(14, 'days');
        // get data for each section
        const thisWeeksJobs = await Job.find({ jobMailDate: { $gte: thisMonday, $lt: nextMonday } })
                .populate('jobClient jobRep')
                .sort({
                        jobMailDate: 'asc',
                });
        const lastTwoWeeksJobs = await Job.find({ jobMailDate: { $gte: mondayBeforeLast, $lt: thisMonday } })
                .populate('jobClient jobRep')
                .sort({
                        jobMailDate: 'asc',
                });
        const nextWeeksJobs = await Job.find({ jobMailDate: { $gte: nextMonday, $lt: mondayAfterNext } })
                .populate('jobClient jobRep')
                .sort({
                        jobMailDate: 'asc',
                });
        // get totals for each section
        const thisWeekTotal = Object.values(thisWeeksJobs).reduce((t, { jobQuantity }) => t + jobQuantity, 0);
        const lastTwoWeeksTotal = Object.values(lastTwoWeeksJobs).reduce((t, { jobQuantity }) => t + jobQuantity, 0);
        const nextWeekTotal = Object.values(nextWeeksJobs).reduce((t, { jobQuantity }) => t + jobQuantity, 0);

        res.render('currentJobs', {
                thisWeeksJobs,
                thisWeekTotal,
                lastTwoWeeksJobs,
                lastTwoWeeksTotal,
                nextWeeksJobs,
                nextWeekTotal,
                title: `Current Mailings`,
        });
};

// form to add a package to a job
exports.addPackage = async (req, res, next) => {
        const job = await Job.findOne({ _id: req.params.id });
        res.render('editPackage', { job, title: `Add a Package to ${job.jobName}` });
};

// add a new package to a job
exports.createPackage = async (req, res) => {
        const job = await Job.findOne({ _id: req.params.id });
        if(req.body.packageScitex === 'on') {req.body.packageScitex = true;}
        Job.updateOne(
                { _id: req.params.id },
                { $push: { packages: req.body } },
                { safe: true, upsert: true },
                (err, data) => console.log(data)
        );
        req.flash('success', `Successfully Created ${req.body.packageName} in ${job.jobName}.`);
        res.redirect(`/job/${job.jobSlug}`);
};

// form to edit an existing package in a job
exports.editPackage = async (req, res, next) => {
        const job = await Job.findOne({ jobSlug: req.params.slug });
        const p = job.packages.id(req.params.id);
        res.render('editPackage', { title: `Edit ${job.jobName} - ${p.packageName}`, p, job });
};

// update an existing package in a job
exports.updatePackage = async (req, res, next) => {
        if(req.body.packageScitex === 'on') {req.body.packageScitex = true;}
        const job = await Job.findOneAndUpdate(
                { jobSlug: req.params.slug, 'packages._id': req.params.id },
                {
                        $set: {
                                'packages.$': req.body,
                        },
                }
        );

        req.flash('success', `Successfully updated <strong>${req.body.packageName} - ${job.jobName}</strong>.`);
        res.redirect(`/job/${job.jobSlug}`);
};

// delete a job
exports.deleteJob = async (req, res, next) => {
        const job = await Job.findByIdAndDelete(req.params.id);
        req.flash('success', `Successfully deleted <strong>${job.jobName}</strong>.`);
        res.redirect(`/jobList/`);
};

// delete a package from a job
exports.deletePackage = async (req, res, next) => {
  const job = await Job.findOne( {jobSlug: req.params.slug} );
  const package = await Job.findOneAndUpdate( { jobSlug: req.params.slug}, {
    '$pull': {
      'packages': {'_id': req.params.id}
    }
  });
  req.flash('success', `Successfully deleted package from <strong>${job.jobName}</strong>.`);
  res.redirect(`/job/${job.jobSlug}/`);


}

// copy a job to make a multi 
exports.createMulti = async (req, res, next ) => {
        // get the job to copy
        const job = await Job.findOne({ _id: req.params.id });
        const newJob = {};
        newJob.jobName = job.jobName + " MULTI";
        newJob.jobClient = job.jobClient;
        newJob.jobRep = job.jobRep;
        newJob.jobMailingMethod = job.jobMailingMethod;
        newJob.jobSize = job.jobSize;
        newJob.jobTags = job.jobTags;
        newJob.jobMatch = job.jobMatch;
        newJob.jobNotes = job.jobNotes;
        newJob.jobMailDate = helpers.moment(job.jobMailDate) + 12096e5;
        newJob.jobQuantity = 0;
        newJob.isMulti = job._id;
        console.log(newJob)
        const newSavedJob = await new Job(newJob).save();
        // update the original job to link to the multi 
        const updatedOriginalJob = await Job.findByIdAndUpdate(req.params.id, {$push: {hasMultis: newSavedJob._id}});
        req.flash('success', `Successfully Created ${newJob.jobName}. The maildate is ${helpers.moment(newJob.jobMailDate).add(9,"hours").format("MM-DD-YY")}. Please update if this is not correct.`);
        res.redirect(`/job/${newSavedJob.jobSlug}`);
}

exports.calendarView = async (req, res, next) => {
        // get the year from the url if available otherwise get current year
        const year = req.params.year || helpers.moment(new Date).format('YYYY');
        // get the month from the url if available otherwise get current month, if the month number is not valid default to current month
        let requestedMonth = req.params.month || helpers.moment(new Date).format('MM');
        requestedMonth.length < 2 ? requestedMonth = '0' + requestedMonth : requestedMonth;
        if(requestedMonth > 13 || requestedMonth < 1) {
                requestedMonth = helpers.moment(new Date).format('MM');
        }
        const viewMonth = helpers.moment(requestedMonth, 'M').format('MMMM');
        // get the first day of the month
        const firstDayOfViewMonth = helpers.moment(`${year}-${requestedMonth}-01`).format('YYYY-MM-01')
        // get what day of the week the first day of the month is
        const firstDayDayOfWeek = helpers.moment(firstDayOfViewMonth).day()
        // calculate the first day on the calendar
        const firstDayOnCalendar = helpers.moment(firstDayOfViewMonth).subtract(firstDayDayOfWeek, 'days').format('YYYY-MM-DD');
        // get all jobs that mail in the calendar days being viewed
        const jobs = await Job.find({ jobMailDate: { $gte: firstDayOnCalendar, $lt: helpers.moment(firstDayOnCalendar).add(42, 'days').format("MM-DD-YYYY") } })
        .sort({
                jobMailDate: 'asc',
        });
        // get first week jobs and total pieces 
        const firstWeekJobsTotal = getJobPiecesTotal(firstDayOnCalendar, helpers.moment(firstDayOnCalendar).add(6, 'days').format("YYYY-MM-DD"), jobs)
        // get second week jobs and total pieces 
        const secondWeekJobsTotal = getJobPiecesTotal(helpers.moment(firstDayOnCalendar).add(7, 'days').format("YYYY-MM-DD"), helpers.moment(firstDayOnCalendar).add(13, 'days').format("YYYY-MM-DD"), jobs)
        // get third week jobs and total pieces 
        const thirdWeekJobsTotal = getJobPiecesTotal(helpers.moment(firstDayOnCalendar).add(14, 'days').format("YYYY-MM-DD"), helpers.moment(firstDayOnCalendar).add(20, 'days').format("YYYY-MM-DD"), jobs)
        // get fourth week jobs and total pieces 
        const fourthWeekJobsTotal = getJobPiecesTotal(helpers.moment(firstDayOnCalendar).add(21, 'days').format("YYYY-MM-DD"), helpers.moment(firstDayOnCalendar).add(27, 'days').format("YYYY-MM-DD"), jobs)
        // get fifth week jobs and total pieces 
        const fifthWeekJobsTotal = getJobPiecesTotal(helpers.moment(firstDayOnCalendar).add(28, 'days').format("YYYY-MM-DD"), helpers.moment(firstDayOnCalendar).add(34, 'days').format("YYYY-MM-DD"), jobs)
        // get sixth week jobs and total pieces 
        const sixthWeekJobsTotal = getJobPiecesTotal(helpers.moment(firstDayOnCalendar).add(35, 'days').format("YYYY-MM-DD"), helpers.moment(firstDayOnCalendar).add(41, 'days').format("YYYY-MM-DD"), jobs)
        res.render('calendarView', {
                year,
                requestedMonth,
                viewMonth,
                firstDayOfViewMonth,
                firstDayDayOfWeek,
                firstDayOnCalendar,
                jobs,
                firstWeekJobsTotal,
                secondWeekJobsTotal,
                thirdWeekJobsTotal,
                fourthWeekJobsTotal,
                fifthWeekJobsTotal,
                sixthWeekJobsTotal,
                title: `Mailings in ${viewMonth}`,
        });
}

// get the piece count for all jobs between two dates
function getJobPiecesTotal(startDay, endDay, jobs) {
        return jobs.filter( (j) => 
                helpers.moment(j.jobMailDate).format("YYYY-MM-DD") >= helpers.moment(startDay).format("YYYY-MM-DD") &&
                helpers.moment(j.jobMailDate).format("YYYY-MM-DD") <= helpers.moment(endDay).format("YYYY-MM-DD")
                )
         .map((j) => {
                let quantity = 0;
                // if the package quantities are available total them with reduce and use that otherwise use the job quantity that was originally input
                j.packages[0] ?  quantity = j.packages.reduce((t, { packageQuantity }) => t + packageQuantity, 0) :  quantity = j.jobQuantity
                return quantity;})
         .reduce(((j, total) => j + total), 0)
}

