const express = require('express');
const jobController = require('../controllers/jobController');
const clientController = require('../controllers/clientController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/', catchErrors(jobController.jobList));
router.get('/add', jobController.addJob);
router.post('/add', catchErrors(jobController.createJob));
router.get('/job/:slug', catchErrors(jobController.getJobBySlug));

router.get('/clients', catchErrors(clientController.clientList));
router.get('/addClient', clientController.addClient);
router.post('/addClient', catchErrors(clientController.createClient));

module.exports = router;
