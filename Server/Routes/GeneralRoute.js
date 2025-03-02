const { ensureAuthenticated } = require('../Middleware/AuthValidation');
const router = require('express').Router();
const { saveWorkflow, fetchWorkflow, updateWorkflow, deleteWorkflow, startWorkflow, handleApproval, uploadPolicy } = require('../Controllers/GeneralController');

router.post('/save-workflow', ensureAuthenticated, saveWorkflow);
router.get('/fetch-workflow', ensureAuthenticated, fetchWorkflow);
router.put('/update-workflow', ensureAuthenticated, updateWorkflow);
router.delete('/delete-workflow/:id', ensureAuthenticated, deleteWorkflow);
router.post('/start-workflow', ensureAuthenticated, startWorkflow);
router.post('/approve-workflow', ensureAuthenticated, handleApproval);
router.post('/upload-policy', ensureAuthenticated, uploadPolicy);

module.exports = router;
