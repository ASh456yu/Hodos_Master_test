const { fetchTravel, updateTravelStatus } = require('../Controllers/TravelController');
const { ensureAuthenticated } = require('../Middleware/AuthValidation');

const router = require('express').Router();


router.get('/fetch', ensureAuthenticated, fetchTravel);
router.patch("/update-status", updateTravelStatus);

module.exports = router;
