const express = require('express');
const jobController = require('../controllers/jobController');
const clientController = require('../controllers/clientController');
const agencyController = require('../controllers/agencyController');
const repController = require('../controllers/repController');
const rateController = require('../controllers/rateController');
const skidController = require('../controllers/skidController');
const commingleController = require('../controllers/commingleController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

// Job Routes
router.get('/', catchErrors(jobController.currentJobs));
router.get('/jobList', catchErrors(jobController.jobList));
router.get('/clientJobList/:clientSlug', catchErrors(jobController.jobsByClient));
router.get('/agencyJobList/:agencySlug', catchErrors(jobController.jobsByAgency));
router.get('/repJobList/:repSlug', catchErrors(jobController.jobsByRep));
router.get('/addJob', jobController.addJob);
router.post('/addJob', catchErrors(jobController.createJob));
router.post('/addJob/:id', catchErrors(jobController.updateJob));
router.get('/job/:jobSlug', catchErrors(jobController.getJobBySlug));
router.get('/jobs/:id/edit', catchErrors(jobController.editJob));
router.get('/deleteJob/:id', jobController.deleteJob);

// Package Routes
router.get('/addPackage/:id', catchErrors(jobController.addPackage));
router.post('/createPackage/:id', catchErrors(jobController.createPackage));
router.get('/editPackage/:slug/:id', catchErrors(jobController.editPackage));
router.post('/updatePackage/:slug/:id', catchErrors(jobController.updatePackage));
router.get('/deletePackage/:slug/:id', jobController.deletePackage);

// Client Routes
router.get('/clientList', catchErrors(clientController.clientList));
router.get('/addClient', clientController.addClient);
router.post(
        '/addClient',
        clientController.upload,
        catchErrors(clientController.resize),
        catchErrors(clientController.createClient)
);
router.get('/client/:clientSlug', catchErrors(clientController.getClientBySlug));
router.get('/clients/:id/edit', catchErrors(clientController.editClient));
router.post(
        '/addClient/:id',
        clientController.upload,
        catchErrors(clientController.resize),
        catchErrors(clientController.updateClient)
);

// Rep Routes
router.get('/repList', catchErrors(repController.repList));
router.get('/addRep', repController.addRep);
router.post('/addRep', catchErrors(repController.createRep));
router.get('/rep/:repSlug', catchErrors(repController.getRepBySlug));

// Agency Routes
router.get('/agencyList', catchErrors(agencyController.agencyList));
router.get('/addAgency', agencyController.addAgency);
router.post('/addAgency', catchErrors(agencyController.createAgency));
router.get('/agency/:agencySlug', catchErrors(agencyController.getAgencyBySlug));
router.get('/agency/:id/edit', catchErrors(agencyController.editAgency));
router.post('/addAgency/:id', catchErrors(agencyController.updateAgency));

// Rate Routes
router.get('/rateList', catchErrors(rateController.rateList));
router.get('/addRate', rateController.addRate);
router.post('/addRate', catchErrors(rateController.createRate));
router.get('/rate/:id/edit', catchErrors(rateController.editRate));
router.post('/addRate/:id', catchErrors(rateController.updateRate));
router.get('/setAgencyRate/', catchErrors(rateController.editAgencyRate));
router.post('/updateAgencyRate/', catchErrors(rateController.updateAgencyRate));
router.get('/editClientRate/:slug', rateController.editClientRate);
router.post('/updateClientRate/:id', rateController.updateClientRate);

// Commingle Routes
router.get('/commingle/:slug', catchErrors(commingleController.createCommingleSheet));
router.post('/commingle/:slug', catchErrors(commingleController.recalculateCommingleSheet));
router.post('/updateCommingle/:id', catchErrors(commingleController.updateCommingleSheet));

// Skid Routes
router.get('/shipping/:slug', catchErrors(skidController.jobShipping));
router.get('/addSkid/:id', catchErrors(skidController.addSkid));
router.post('/addSkid/', catchErrors(skidController.createSkid));
router.get('/editSkid/:id', catchErrors(skidController.editSkid));
router.post('/addSkid/:id', catchErrors(skidController.updateSkid));
router.get('/deleteSkid/:slug/:id', catchErrors(skidController.deleteSkid));
router.get('/shipping/', catchErrors(skidController.daysShipping));
router.get('/shipping/:date', catchErrors(skidController.dateShipping));

// API Endpoints
router.get('/api/search', catchErrors(jobController.searchJobs));

module.exports = router;
