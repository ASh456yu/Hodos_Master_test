const TripModel = require('../Models2/Trips')
const mongoose = require("mongoose");
const WorkflowModel = require('../Models/Workflows');



const fetchTravel = async (req, res) => {
    try {
        const company = req.user.company;
        const userId = new mongoose.Types.ObjectId(req.user._id);
        
        if (!company) {
            return res.status(403).json({ success: false, error: "Unauthorized access" });
        }


        const trips = await TripModel.find({
            company: company,
            $or: [
                { "workflow.currentApprover": userId },
                { "workflow.approvalHistory.approverId": userId }
            ]
        })

        res.status(200).json({ success: true, trips });
    } catch (error) {
        console.error("Error fetching user-related trips:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};



const updateTravelStatus = async (req, res) => {
    try {
        const { tripId, status } = req.body;

        const trip = await TripModel.findById(tripId).populate({
            path: 'workflow.id',
            model: WorkflowModel,
            select: 'nodes edges'
        });

        if (!trip) {
            return res.status(404).json({ success: false, error: "Trip not found." });
        }
        const currentNode = trip.workflow.id.nodes.find(node => node.id === trip.workflow.currentNode);
        const outgoingEdges = trip.workflow.id.edges.filter(edge => edge.source === trip.workflow.currentNode);
        const targetNodeIds = outgoingEdges.map(edge => edge.target);
        const connectedNodes = trip.workflow.id.nodes.filter(node => targetNodeIds.includes(node.id));

        if (status == "Approved") {
            
            if (connectedNodes.length > 0) {
                if (trip.status == 'pending_final_claim_approval') {
                    await TripModel.findByIdAndUpdate(tripId, {
                        status: 'completed',
                    });
                } else {
                    if (connectedNodes[0].data.action == 1) {
                        await TripModel.findByIdAndUpdate(tripId, {
                            status: 'pending_trip_approval',
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
                    } else if (connectedNodes[0].data.action == 2) {
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
        } else if (status == "Rejected") {
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




        res.status(200).json({ success: true, message: "Trip status updated successfully.", trip: trip });
    } catch (error) {
        console.error("Error updating travel status:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


module.exports = {
    fetchTravel,
    updateTravelStatus,
};
