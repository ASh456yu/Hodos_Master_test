const WorkflowModel = require('../Models/Workflows');
const WorkflowService = require('../services/workflowService');
const UserModel = require("../Models/User");
const { putObject } = require('./AWSController')

const saveWorkflow = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated", success: false });
        }

        const {
            name,
            nodes,
            edges,
            initiateTrip,
            tripApproval,
            claimApproval,
            finalClaimApproval
        } = req.body;

        const userId = req.user._id;

        if (!name || !nodes || !edges) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const formattedNodes = nodes.map(node => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: {
                userId: node.data.userId || null,
                label: node.data.label || null,
                action: node.data.action
            }
        }));

        const formattedEdges = edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle || 'output-1',
            targetHandle: edge.targetHandle || 'input-1',
            type: edge.type || 'customEdge',
            data: edge.data
        }));

        const newWorkflow = new WorkflowModel({
            name,
            user: userId,
            nodes: formattedNodes,
            edges: formattedEdges,
        });

        const savedWorkflow = await newWorkflow.save();

        try {
            // Update users in initiateTrip array with action 0
            if (initiateTrip && initiateTrip.length > 0) {
                await UserModel.updateMany(
                    { _id: { $in: initiateTrip } },
                    {
                        $set: {
                            'workflow.workflow_id': savedWorkflow._id,
                            'workflow.action': 0
                        }
                    }
                );
            }

            // Update users in tripApproval array with action 1
            if (tripApproval && tripApproval.length > 0) {
                await UserModel.updateMany(
                    { _id: { $in: tripApproval } },
                    {
                        $set: {
                            'workflow.workflow_id': savedWorkflow._id,
                            'workflow.action': 1
                        }
                    }
                );
            }

            // Update users in claimApproval array with action 2
            if (claimApproval && claimApproval.length > 0) {
                await UserModel.updateMany(
                    { _id: { $in: claimApproval } },
                    {
                        $set: {
                            'workflow.workflow_id': savedWorkflow._id,
                            'workflow.action': 2
                        }
                    }
                );
            }

            // Update finalClaimApproval user with action 3
            if (finalClaimApproval) {
                await UserModel.findByIdAndUpdate(
                    finalClaimApproval,
                    {
                        $set: {
                            'workflow.workflow_id': savedWorkflow._id,
                            'workflow.action': 3
                        }
                    }
                );
            }
        } catch (updateError) {
            // If user updates fail, delete the saved workflow and throw error
            await WorkflowModel.findByIdAndDelete(savedWorkflow._id);
            throw new Error('Failed to update users with workflow information');
        }

        return res.status(201).json({ message: "Workflow saved successfully", success: true });
    } catch (err) {
        console.error("Error saving workflow:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const fetchWorkflow = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated", success: false });
        }

        const userId = req.user._id;

        const workflows = await WorkflowModel.find({
            user: userId
        })

        return res.status(201).json({ message: "Workflow fetched successfully", success: true, workflows: workflows });
    } catch (err) {
        console.error("Error saving workflow:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const updateWorkflow = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated", success: false });
        }

        const { workflowId, name, nodes, edges } = req.body;
        const userId = req.user._id;

        if (!workflowId || !name || !nodes || !edges) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const updatedWorkflow = await WorkflowModel.findOneAndUpdate(
            { _id: workflowId, user: userId },
            { name, nodes, edges },
            { new: true }
        );

        if (!updatedWorkflow) {
            return res.status(404).json({ message: "Workflow not found", success: false });
        }

        return res.status(200).json({ message: "Workflow updated successfully", success: true });
    } catch (err) {
        console.error("Error updating workflow:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const deleteWorkflow = async (req, res) => {
    const { id } = req.params;

    try {
        const workflow = await WorkflowModel.findByIdAndDelete(id);

        if (!workflow) {
            return res.status(404).json({ message: "Workflow not found", success: false });
        }

        return res.status(200).json({ message: "Workflow deleted successfully", success: true });
    } catch (err) {
        console.error("Error deleting workflow:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const startWorkflow = async (req, res) => {
    try {
        const { invoiceId } = req.body;
        const result = await WorkflowService.startWorkflow(invoiceId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const handleApproval = async (req, res) => {
    try {
        const { invoiceId, approved } = req.body;
        const userId = req.user.id;

        const result = await WorkflowService.handleApproval(invoiceId, userId, approved);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const uploadPolicy = async (req, res) => {
    try {
        
        const { contentType } = req.body;
        const fileName = `${req.user.company}-policy-${Date.now()}.pdf`
        
        const url = await putObject(fileName, contentType)

        res.status(200).json({ url: url, fileName: fileName });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createMarkdown = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {
    saveWorkflow,
    fetchWorkflow,
    updateWorkflow,
    deleteWorkflow,
    startWorkflow,
    handleApproval,
    uploadPolicy
};
