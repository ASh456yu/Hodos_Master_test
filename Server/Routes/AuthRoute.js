const { signup, login, upload_employees, logout, userInfo } = require('../Controllers/AuthController');
const { signupValidation, loginValidation, ensureAuthenticated } = require('../Middleware/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/upload', ensureAuthenticated, upload_employees);
router.post('/userinfo', ensureAuthenticated, userInfo);
router.get('/validate', ensureAuthenticated, (req, res) => {
    res.json({ message: 'You are authenticated', user: req.user });
});
router.post('/logout', ensureAuthenticated, logout);



module.exports = router;