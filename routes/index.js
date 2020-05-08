const express = require('express');
const jobController = require('../controllers/jobController');
const clientController = require('../controllers/clientController');
const agencyController = require('../controllers/agencyController');
const repController = require('../controllers/repController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/jobList', catchErrors(jobController.jobList)); // TODO: Change to /jobs after creating homepage
router.get('/addJob', jobController.addJob);
router.post('/addJob', catchErrors(jobController.createJob));
router.get('/job/:slug', catchErrors(jobController.getJobBySlug));

router.get('/clientList', catchErrors(clientController.clientList));
router.get('/addClient', clientController.addClient);
router.post('/addClient', catchErrors(clientController.createClient));
router.get('/client/:slug', catchErrors(clientController.getClientBySlug));

router.get('/repList', catchErrors(repController.repList));
router.get('/addrep', repController.addRep);
router.post('/addrep', catchErrors(repController.createRep));
router.get('/rep/:slug', catchErrors(repController.getrepBySlug));

router.get('/agencyList', catchErrors(agencyController.agencyList));
router.get('/addAgency', agencyController.addAgency);
router.post('/addAgency', catchErrors(agencyController.createAgency));
router.get('/agency/:slug', catchErrors(agencyController.getAgencyBySlug));

module.exports = router;
