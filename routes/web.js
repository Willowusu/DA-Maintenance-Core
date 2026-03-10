var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/privacy-policy', function(req, res, next) {
  res.render('web/privacy-policy');
});

/* GET users listing. */
router.get('/delete-account', function(req, res, next) {
  res.render('web/delete-account');
});

module.exports = router;
