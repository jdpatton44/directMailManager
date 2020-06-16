const mongoose = require('mongoose');

const Rep = mongoose.model('Rep');
const Job = mongoose.model('Job');
const Agency = mongoose.model('Agency');

exports.repList = async (req, res) => {
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all reps
        const repsPromise = Rep.find()
                .skip(skip)
                .limit(limit)
                .populate('repAgency')
                .sort({ repMailDate: 'desc' });
        const countPromise = Rep.count();
        const [reps, count] = await Promise.all([repsPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!reps.length && skip) {
                req.flash('info', `Hey You asked for page ${page}. But that doesn't exist.  Here is page ${pages}`);
                res.redirect(`/reps/page/${pages}`);
        }
        res.render('repList', { reps, pages, page, title: 'Reps' });
};

exports.addRep = async (req, res) => {
        console.log(req.body);
        agencies = await Agency.find();
        res.render('editRep', { agencies, title: 'Add Rep' });
};

exports.createRep = async (req, res) => {
        console.log(req.body);
        const rep = await new Rep(req.body).save();
        req.flash('success', `Successfully Created ${rep.repName}.`);
        res.redirect(`/rep/${rep.repSlug}`);
};

exports.getRepBySlug = async (req, res, next) => {
        const rep = await Rep.findOne({ repSlug: req.params.repSlug }).populate('repAgency');
        const repJobs = await Job.find({ jobRep: rep._id }).populate('jobClient jobRep');
        if (!rep) return next();
        res.render('rep', { rep, repJobs, title: rep.repName });
};

exports.editRep = async (req, res, next) => {
        const rep = await Rep.findOne({ _id: req.params.id });
        if (!rep) return next();
        res.render('editRep', { rep, title: `Edit ${rep.repName}` });
};

exports.updateRep = async (req, res, next) => {
        const rep = await Rep.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
        }).exec();
        req.flash(
                'success',
                `Successfully updated <strong>${rep.repName}</strong>.`
        );
        res.redirect(`/rep/${rep.repSlug}`);
};
