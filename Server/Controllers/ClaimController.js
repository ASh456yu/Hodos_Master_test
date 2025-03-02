const InvoiceModel = require('../Models2/Invoice.js');
const WorkflowService = require('../services/workflowService.js');
const WorkflowModel = require('../Models/Workflows');
const UserModel = require('../Models/User.js');
const mongoose = require('mongoose');
const TripModel = require('../Models2/Trips.js');

const getPendingInvoices = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const company = req.user.company;

        const pendingInvoices = await InvoiceModel.find({
            company: company,
        }).populate('trip_id');
        const filtered = pendingInvoices.filter(inv =>
            inv.trip_id.workflow.currentApprover.equals(userId)
        );

        return res.json({ 'mydata': filtered });
    } catch (error) {
        console.error('Get Pending Invoices Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const handleApproval = async (req, res) => {
    try {
        const { taskId, approved } = req.body;
        const userId = req.user._id;

        const invoice = await InvoiceModel.findById(taskId)
        const trip = await TripModel.findById(invoice.trip_id).populate({
            path: 'workflow.id',
            model: WorkflowModel,
            select: 'nodes edges'
        });

        if (!invoice) {
            return res.status(404).json({ success: false, error: "Invoice not found." });
        }

        if (!trip) {
            return res.status(404).json({ success: false, error: "Trip not found." });
        }

        const currentNode = trip.workflow.id.nodes.find(node => node.id === trip.workflow.currentNode);
        const outgoingEdges = trip.workflow.id.edges.filter(edge => edge.source === trip.workflow.currentNode);
        const targetNodeIds = outgoingEdges.map(edge => edge.target);
        const connectedNodes = trip.workflow.id.nodes.filter(node => targetNodeIds.includes(node.id));
        const tripId = trip._id;

        if (approved) {
            if (trip.status == 'pending_final_claim_approval') {
                await TripModel.findByIdAndUpdate(tripId, {
                    status: 'completed',
                    'workflow.currentNode': null,
                            'workflow.currentApprover': null,
                    $push: {
                        'workflow.approvalHistory': {
                            nodeId: currentNode.id,
                            approverId: currentNode.data.userId,
                            approved: true,
                            comments: "comments",
                            timestamp: new Date()
                        }
                    }
                });
            } else {
                if (connectedNodes.length > 0) {

                    if (connectedNodes[0].data.action == 2) {
                        await TripModel.findByIdAndUpdate(tripId, {
                            status: 'pending_claim_approval',
                            'workflow.currentNode': connectedNodes[0].id,
                            'workflow.currentApprover': connectedNodes[0].data.userId,
                            $push: {
                                'workflow.approvalHistory': {
                                    nodeId: currentNode.id,
                                    approverId: currentNode.data.userId,
                                    approved: true,
                                    comments: "comments",
                                    timestamp: new Date()
                                }
                            }
                        });


                    } else if (connectedNodes[0].data.action == 3) {
                        await TripModel.findByIdAndUpdate(tripId, {
                            status: 'pending_final_claim_approval',
                            'workflow.currentNode': connectedNodes[0].id,
                            'workflow.currentApprover': connectedNodes[0].data.userId,
                            $push: {
                                'workflow.approvalHistory': {
                                    nodeId: currentNode.id,
                                    approverId: currentNode.data.userId,
                                    approved: true,
                                    comments: "comments",
                                    timestamp: new Date()
                                }
                            }
                        });
                    }



                }
            }

        } else {

            await TripModel.findByIdAndUpdate(tripId, {
                status: 'rejected',
                $push: {
                    'workflow.approvalHistory': {
                        nodeId: currentNode.id,
                        approverId: currentNode.data.userId,
                        approved: false,
                        comments: "comments",
                        timestamp: new Date()
                    }
                }
            });
        }


        return res.json({
            message: approved ? 'Invoice approved' : 'Invoice rejected',
            invoiceId: taskId
        });
    } catch (error) {
        console.error('Handle Approval Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { handleApproval, getPendingInvoices };