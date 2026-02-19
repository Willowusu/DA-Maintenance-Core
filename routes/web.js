var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/privacy-policy', function(req, res, next) {
  res.render('privacy-policy');
});

module.exports = router;
