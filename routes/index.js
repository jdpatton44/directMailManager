const express = require('express');
const jobController = require('../controllers/jobController');
const clientController = require('../controllers/clientController');
const agencyController = require('../controllers/agencyController');
const repController = require('../controllers/repController');
const rateController = require('../controllers/rateController');
const skidController = require('../controllers/skidController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const commingleController = require('../controllers/commingleController');
const truckController = require('../controllers/truckController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

// Job Routes
router.get('/currentJobs', catchErrors(jobController.currentJobs));
router.get('/jobList', authController.isLoggedIn, catchErrors(jobController.jobList));
router.get('/jobList/page/:page', authController.isLoggedIn, catchErrors(jobController.jobList));
router.get('/clientJobList/:clientSlug', authController.isLoggedIn, catchErrors(jobController.jobsByClient));
router.get('/agencyJobList/:agencySlug', authController.isLoggedIn, catchErrors(jobController.jobsByAgency));
router.get('/repJobList/:repSlug', authController.isLoggedIn, catchErrors(jobController.jobsByRep));
router.get('/addJob', authController.isLoggedIn, jobController.addJob);
router.post('/addJob', authController.isLoggedIn, catchErrors(jobController.createJob));
router.post('/addJob/:id', authController.isLoggedIn, catchErrors(jobController.updateJob));
router.post('/updateNotes/:id', authController.isLoggedIn, catchErrors(jobController.updateJobNotes));
router.get('/job/:jobSlug', authController.isLoggedIn, catchErrors(jobController.getJobBySlug));
router.get('/job/id/:id', authController.isLoggedIn, catchErrors(jobController.getJobById));
router.get('/jobs/:id/edit', authController.isLoggedIn, catchErrors(jobController.editJob));
router.get('/deleteJob/:id', authController.isLoggedIn, jobController.deleteJob);
router.get('/jobCalendar/:year?/:month?', jobController.calendarView);
router.get('/createMulti/:id', authController.isLoggedIn, jobController.createMulti);

// Package Routes
router.get('/addPackage/:id', authController.isLoggedIn, catchErrors(jobController.addPackage));
router.post('/createPackage/:id', authController.isLoggedIn, catchErrors(jobController.createPackage));
router.get('/editPackage/:slug/:id', authController.isLoggedIn, catchErrors(jobController.editPackage));
router.post('/updatePackage/:slug/:id', authController.isLoggedIn, catchErrors(jobController.updatePackage));
router.get('/deletePackage/:slug/:id', authController.isLoggedIn, authController.isLoggedIn, jobController.deletePackage);

// Client Routes
router.get('/clientList', authController.isLoggedIn, catchErrors(clientController.clientList));
router.get('/addClient', authController.isLoggedIn, clientController.addClient);
router.post(
  '/addClient', authController.isLoggedIn,
  clientController.upload,
  catchErrors(clientController.resize),
  catchErrors(clientController.createClient)
);
router.get('/client/:clientSlug', authController.isLoggedIn, catchErrors(clientController.getClientBySlug));
router.get('/clients/:id/edit', authController.isLoggedIn, catchErrors(clientController.editClient));
router.post(
  '/addClient/:id', authController.isLoggedIn,
  clientController.upload,
  catchErrors(clientController.resize),
  catchErrors(clientController.updateClient)
);

// Rep Routes
router.get('/repList', authController.isLoggedIn, catchErrors(repController.repList));
router.get('/addRep', authController.isLoggedIn, repController.addRep);
router.post('/addRep', authController.isLoggedIn, catchErrors(repController.createRep));
router.get('/rep/:repSlug', authController.isLoggedIn, catchErrors(repController.getRepBySlug));
router.get('/rep/:id/edit', authController.isLoggedIn, catchErrors(repController.editRep));
router.post('/addRep/:id', authController.isLoggedIn, catchErrors(repController.updateRep));

// Agency Routes
router.get('/agencyList', authController.isLoggedIn, catchErrors(agencyController.agencyList));
router.get('/addAgency', authController.isLoggedIn, agencyController.addAgency);
router.post('/addAgency', authController.isLoggedIn, catchErrors(agencyController.createAgency));
router.get('/agency/:agencySlug', authController.isLoggedIn, catchErrors(agencyController.getAgencyBySlug));
router.get('/agency/:id/edit', authController.isLoggedIn, catchErrors(agencyController.editAgency));
router.post('/addAgency/:id', authController.isLoggedIn, catchErrors(agencyController.updateAgency));

// Rate Routes
router.get('/rateList', authController.isLoggedIn, catchErrors(rateController.rateList));
router.get('/addRate', authController.isLoggedIn, rateController.addRate);
router.post('/addRate', authController.isLoggedIn, catchErrors(rateController.createRate));
router.get('/rate/:id/edit', authController.isLoggedIn, catchErrors(rateController.editRate));
router.post('/addRate/:id', authController.isLoggedIn, catchErrors(rateController.updateRate));
router.get('/setAgencyRate/', authController.isLoggedIn, catchErrors(rateController.editAgencyRate));
router.post('/updateAgencyRate/', authController.isLoggedIn, catchErrors(rateController.updateAgencyRate));
router.get('/editClientRate/:slug', authController.isLoggedIn, rateController.editClientRate);
router.post('/updateClientRate/:id', authController.isLoggedIn, rateController.updateClientRate);

// Commingle Routes
router.get('/commingle/:slug', authController.isLoggedIn, catchErrors(commingleController.createCommingleSheet));
router.post('/commingle/:slug', authController.isLoggedIn, catchErrors(commingleController.recalculateCommingleSheet));
router.post('/updateCommingle/:id', authController.isLoggedIn, catchErrors(commingleController.updateCommingleSheet));

// Skid Routes
router.get('/shipping/:slug', authController.isLoggedIn, catchErrors(skidController.jobShipping));
router.get('/addSkid/:id/:count', authController.isLoggedIn, catchErrors(skidController.addSkid)); authController.isLoggedIn, authController.isLoggedIn,
router.post('/addSkid/', authController.isLoggedIn, catchErrors(skidController.createSkid));
router.get('/editSkid/:id', authController.isLoggedIn, catchErrors(skidController.editSkid));
router.post('/addSkid/:id', authController.isLoggedIn, catchErrors(skidController.updateSkid));
router.get('/deleteSkid/:slug/:id', authController.isLoggedIn, catchErrors(skidController.deleteSkid));
router.get('/shippingToday/:date', authController.isLoggedIn, catchErrors(skidController.daysShipping));
router.post('/shippingByDate/', authController.isLoggedIn, catchErrors(skidController.daysShipping));

// Truck Routes
router.get('/truck/viewTruck/:id', authController.isLoggedIn, catchErrors(truckController.viewTruck));
router.get('/truck/viewTrucks/truckList', authController.isLoggedIn, catchErrors(truckController.truckList));
router.get('/truck/newTruck/', authController.isLoggedIn, catchErrors(truckController.newTruck));
router.post('/truck/createTruck/', authController.isLoggedIn, catchErrors(truckController.addTruck));

router.get('/truck/unload/:id', authController.isLoggedIn, catchErrors(truckController.unloadTruck));
router.get('/truck/unloadSkid/:truckId/:skidId', authController.isLoggedIn, catchErrors(truckController.removeSkid));
router.get('/truck/deleteTruck/:id', authController.isLoggedIn, catchErrors(truckController.deleteTruck));

// router.get('/truck/editTruck/:id', catchErrors(truckController.editTruck))
// router.post('/truck/updateTruck/:id', catchErrors(truckController.updateTruck))

// User / Auth routes
router.get('/login', userController.loginForm);
router.get('/', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account',  authController.isLoggedIn, catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);


// API Endpoints
router.get('/api/search', catchErrors(jobController.searchJobs));

module.exports = router;
