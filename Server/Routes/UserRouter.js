const { saveChat, fetchChat } = require('../Controllers/ChatController');
const {ensureAuthenticated} = require('../Middleware/AuthValidation');
const UserModel = require('../Models/User');



const router = require('express').Router();

router.get('/details', ensureAuthenticated, async (req, res) => {
    const userDomain = req.user['email'].split('@')[1];

    var users = await UserModel.find({
        email: { $regex: `@${userDomain}$`, $options: 'i' } ,
    });

    // users = users.filter((usr)=>(""+usr['_id'])!==req.user['_id']) // this excludes the sender itself
    
    res.status(200).json({ success: true, users });
});


router.post('/save-chat', saveChat)
router.post('/fetch-chat', fetchChat)




module.exports = router;