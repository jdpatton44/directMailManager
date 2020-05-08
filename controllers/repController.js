const mongoose = require('mongoose');

const Rep = mongoose.model('Rep');

exports.repList = async (req, res) => {
        const page = req.params.page || 1;
        const limit = 25;
        const skip = page * limit - limit;
        // query db for all reps
        const repsPromise = Rep.find()
                .skip(skip)
                .limit(limit)
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

exports.addRep = (req, res) => {
        console.log(req.body);
        res.render('editRep', { title: 'Add Rep' });
};

exports.createRep = async (req, res) => {
        console.log(req.body);
        const rep = await new Rep(req.body).save();
        req.flash('success', `Successfully Created ${rep.repName}.`);
        res.redirect(`/rep/${rep.slug}`);
};

exports.getRepBySlug = async (req, res, next) => {
        const rep = await Rep.findOne({ slug: req.params.slug });
        console.log(req.params);
        if (!rep) return next();
        res.render('rep', { rep, title: rep.repName });
};
