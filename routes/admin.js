var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin/login', { layout: 'layouts/admin/auth', title: 'Admin Login', activePage: 'login' });
});

/* GET users listing. */
router.get('/summary', function (req, res, next) {
    res.render('admin/summary', { layout: 'layouts/admin/main', title: 'Admin Summary', activePage: 'summary' });
});

/* GET users listing. */
router.get('/reports', function (req, res, next) {
    res.render('admin/reports', { layout: 'layouts/admin/main', title: 'Admin Reports', activePage: 'reports' });
});

/* GET users listing. */
router.get('/businesses', function (req, res, next) {
    res.render('admin/businesses', { layout: 'layouts/admin/main', title: 'Admin Businesses', activePage: 'businesses' });
});

/* GET users listing. */
router.get('/users', function (req, res, next) {
    res.render('admin/users', { layout: 'layouts/admin/main', title: 'Admin Users', activePage: 'users' });
});

/* GET users listing. */
router.get('/faults', function (req, res, next) {
    res.render('admin/faults', { layout: 'layouts/admin/main', title: 'Admin Faults', activePage: 'faults' });
});

/* GET users listing. */
router.get('/services', function (req, res, next) {
    res.render('admin/services', { layout: 'layouts/admin/main', title: 'Admin Services', activePage: 'services' });
});

/* GET users listing. */
router.get('/system-users', function (req, res, next) {
    res.render('admin/systemUsers', { layout: 'layouts/admin/main', title: 'System User Management', activePage: 'system-users' });
});


module.exports = router;
