const router = require('express').Router();
const { upload_budget_bulk, fetch_budget } = require('../Controllers/BudgetController')
const { ensureAuthenticated } = require('../Middleware/AuthValidation')

router.post('/upload_bulk', ensureAuthenticated, upload_budget_bulk);
router.get("/fetch", ensureAuthenticated, fetch_budget);


module.exports = router;
