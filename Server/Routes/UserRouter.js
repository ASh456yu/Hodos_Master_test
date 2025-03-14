const { saveChat, fetchChat } = require('../Controllers/ChatController');
const { ensureAuthenticated } = require('../Middleware/AuthValidation');
const UserModel = require('../Models/User');



const router = require('express').Router();

router.get('/details', ensureAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        
        const userDomain = user.email.split('@')[1];

        var users = await UserModel.find({
            email: { $regex: `@${userDomain}$`, $options: 'i' },
        });

        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
});


router.post('/save-chat', saveChat)
router.post('/fetch-chat', fetchChat)




module.exports = router;