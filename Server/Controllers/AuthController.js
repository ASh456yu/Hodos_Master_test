const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");

const signup = async (req, res) => {
    try {
        const { name, email, password, company, employee_id, position, department } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const approvals = {
            trip_approval: 1,
            claim_approval: 1,
            workflow_approval: 1,
        }
        const workflow = {
            workflow_id: null,
            action: null
        };

        const userModel = new UserModel({ name, email, password, company, employee_id, position, department, approvals, workflow });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();

        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        const errorMsg = 'Authentication failed: Invalid email or password';

        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, name: user.name, company: user.company, position: user.position, approvals: user.approvals },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.cookie('projectA_token', jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 180 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            success: true,
            email: user.email,
            name: user.name,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

const upload_employees = async (req, res) => {
    try {
        const { users } = req.body;
        const company = req.user.company
        
        if (!users || !Array.isArray(users)) {
            return res.status(400).json({ success: false, error: "Invalid data format" });
        }

        const users2 = await Promise.all(
            users.map(async (user) => ({
                name: user.name,
                email: user.mail,
                position: user.position,
                employee_id: user.employee_id,
                company: company,
                department: user.Department,
                password: await bcrypt.hash(user.password, 10),
                approvals: {
                    trip_approval: Number(user.trip_approval), 
                    claim_approval: Number(user.claim_approval), 
                    workflow_approval: Number(user.workflow_approval)
                },
                workflow: {
                    workflow_id: null,
                    action: null
                }
            }))
        );

        await UserModel.insertMany(users2);

        res.status(201).json({ success: true, message: "Users saved successfully" });
    } catch (error) {
        console.error("Error inserting users:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('projectA_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return res.status(200).json({
            message: 'Logged out successfully',
            success: true
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            message: 'Something went wrong',
            success: false
        });
    }
};

module.exports = {
    signup,
    login,
    upload_employees,
    logout,
}