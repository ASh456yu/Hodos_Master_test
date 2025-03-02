const router = require('express').Router();
const { ensureAuthenticated } = require('../Middleware/AuthValidation')
const { handleApproval, getPendingInvoices } = require('../Controllers/ClaimController')


router.post('/approve', ensureAuthenticated, handleApproval);
router.post('/pending', ensureAuthenticated, getPendingInvoices);


module.exports = router;
