const mongoose = require('mongoose');

const Agency = mongoose.model('Agency');

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
        const agency = await Agency.findOne({ agencySlug: req.params.agencySlug });
        if (!agency) return next();
        res.render('agency', { agency, title: agency.agencyName });
};
