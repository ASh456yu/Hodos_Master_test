const Joi = require('joi');
const jwt = require('jsonwebtoken');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        company: Joi.string().required(),
        employee_id: Joi.string().required(),
        position: Joi.string().required(),
        password: Joi.string().min(4).max(100).required(),
        department: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}


const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}


const ensureAuthenticated = (req, res, next) => {
    
    const token = req.cookies.projectA_token;
    
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required', success: false, context: req.cookies });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is invalid or expired' });
    }
};



module.exports = {
    signupValidation,
    loginValidation,
    ensureAuthenticated
}