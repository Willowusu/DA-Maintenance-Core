var express = require('express');
var router = express.Router();
const {authenticate} = require('../middlewares');
const upload = require('../utils/cloudinary');
const businessController = require('../controllers/businessController');
const userController = require('../controllers/userController');
const serviceController = require('../controllers/serviceController');
const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');


//route to get logged in user details
router.get('/auth/me', authenticate, authController.getProfile);

//route to update logged in user details
router.put('/auth/me', authenticate, authController.updateProfile);

//route to request for otp
router.post('/auth/request-otp', authController.requestOtp);

//route to verify otp
router.post('/auth/verify-otp', authController.verifyOtp);

// route to create a business
router.post('/businesses', businessController.createBusiness);

// route to get business details
router.get('/businesses/:id', authenticate, businessController.getBusinessById);

// route to get all businesses
router.get('/businesses', authenticate, businessController.getBusinesses);

//route to get all user tied toa business
router.get('/users', authenticate, userController.getUsersByBusiness);

//route to get all users
router.get('/all-users', authenticate, userController.getUsers);

//route to get user by id
router.get('/users/:id', authenticate, userController.getUserById);

// route to create a service
router.post('/services', serviceController.createService);

// route to get all services
router.get('/services', authenticate, serviceController.getServices);

// route to get service by id
router.get('/services/:id', authenticate, serviceController.getServiceById);

// route to create a fault report
router.post('/fault-reports', authenticate, upload.array('images', 5), reportController.createFaultReport);

// route to get fault reports
router.get('/fault-reports', authenticate, reportController.getFaultReports);

// route to get specfic fault report with id
router.get('/fault-reports/:id', authenticate, reportController.getFaultReportById);

// route to update fault report status
router.put('/fault-reports/:id/status', authenticate, reportController.updateFaultReportStatus);

// route to create a user
router.post('/users', userController.createUser);

module.exports = router;
