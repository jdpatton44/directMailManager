const mongoose = require('mongoose');

const Agency = mongoose.model('Agency');
const Rep = mongoose.model('Rep');
const Job = mongoose.model('Job');

exports.agencyList = async (req, res) => {
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all agencies
        const agenciesPromise = Agency.find()
                .skip(skip)
                .limit(limit)
                .sort({ agencyName: 'desc' });
        const countPromise = Agency.count();
        const [agencies, count] = await Promise.all([agenciesPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!agencies.length && skip) {
                req.flash('info', `Hey You asked for page ${page}. But that doesn't exist.  Here is page ${pages}`);
                res.redirect(`/agencies/page/${pages}`);
        }
        res.render('agencyList', { agencies, pages, page, title: 'Agencies' });
};

exports.addAgency = (req, res) => {
        res.render('editAgency', { title: 'Add Agency' });
};

exports.createAgency = async (req, res) => {
        console.log(req.body);
        const agency = await new Agency(req.body).save();
        req.flash('success', `Successfully Created ${agency.agencyName}.`);
        res.redirect(`/agency/${agency.agencySlug}`);
};

exports.getAgencyBySlug = async (req, res, next) => {
        const { agencySlug } = req.params;
        const agency = await Agency.findOne({ agencySlug: agencySlug });
        if (!agency) return next();
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all jobs with reps that are at the agency
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
        const [agencyJobs, count] = await Promise.all([jobsPromise, countPromise]);
        res.render('agency', { agency, agencyJobs, title: agency.agencyName });
};

exports.editAgency = async (req, res, next) => {
        const agency = await Agency.findOne({ _id: req.params.id });
        if (!agency) return next();
        res.render('editAgency', { agency, title: `Edit ${agency.agencyName}` });
};

exports.updateAgency = async (req, res, next) => {
        const agency = await Agency.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
        }).exec();
        req.flash(
                'success',
                `Successfully updated <strong>${agency.agencyName}</strong>.`
        );
        res.redirect(`/agency/${agency.agencySlug}`);
};
