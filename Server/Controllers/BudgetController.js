const BudgetModel = require("../Models/Budgets");

const upload_budget_bulk = async (req, res) => {
    try {
        const { budgets } = req.body;
        const company = req.user.company;



        if (!budgets || !Array.isArray(budgets) || !company) {
            return res.status(400).json({ success: false, message: "Invalid data format" });
        }
        
        const budget_data = budgets.map(budget => ({
            company: company,
            department: budget.department,
            budget: budget.budget
        }));

        const insertedBudgets = await BudgetModel.insertMany(budget_data);
        
        res.status(201).json({ success: true, message: "Budgets uploaded successfully", data: insertedBudgets });
    } catch (error) {
        console.error("Error inserting budgets:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


const fetch_budget = async (req, res) => {
    try {
        const company = req.user.company;

        if (!company) {
            return res.status(400).json({ success: false, message: "company is required" });
        }

        const budgets = await BudgetModel.find({ company: company });

        res.status(200).json({ success: true, data: budgets });
    } catch (error) {
        console.error("Error fetching budgets:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    upload_budget_bulk,
    fetch_budget
};
