const express = require('express');
const jobController = require('../controllers/jobController');
const clientController = require('../controllers/clientController');
const agencyController = require('../controllers/agencyController');
const repController = require('../controllers/repController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/jobList', catchErrors(jobController.jobList)); // TODO: Change to /jobs after creating homepage
router.get('/clientJobList/:clientSlug', catchErrors(jobController.jobsByClient));
router.get('/repJobList/:repSlug', catchErrors(jobController.jobsByRep));
router.get('/addJob', jobController.addJob);
router.post('/addJob', catchErrors(jobController.createJob));
router.post('/addJob/:id', catchErrors(jobController.updateJob));
router.get('/job/:jobSlug', catchErrors(jobController.getJobBySlug));
router.get('/jobs/:id/edit', catchErrors(jobController.editJob));

router.get('/clientList', catchErrors(clientController.clientList));
router.get('/addClient', clientController.addClient);
router.post('/addClient', catchErrors(clientController.createClient));
router.get('/client/:clientSlug', catchErrors(clientController.getClientBySlug));

router.get('/repList', catchErrors(repController.repList));
router.get('/addRep', repController.addRep);
router.post('/addRep', catchErrors(repController.createRep));
router.get('/rep/:repSlug', catchErrors(repController.getRepBySlug));

router.get('/agencyList', catchErrors(agencyController.agencyList));
router.get('/addAgency', agencyController.addAgency);
router.post('/addAgency', catchErrors(agencyController.createAgency));
router.get('/agency/:agencySlug', catchErrors(agencyController.getAgencyBySlug));

// API Endpoints
router.get('/api/search', catchErrors(jobController.searchJobs));

module.exports = router;
