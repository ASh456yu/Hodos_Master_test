import React, { useEffect, useState } from 'react'
import { Node } from '@xyflow/react';
import { handleError } from '../components/utils';

interface NodeData {
    user_id: string | null;
    label: string | null;
    action: number | null;
}

interface WorkFlowModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    nodeData: NodeData;
    setNodeData: React.Dispatch<React.SetStateAction<NodeData>>;
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setInitiateTrip: React.Dispatch<React.SetStateAction<string[]>>;
    setTripApproval: React.Dispatch<React.SetStateAction<string[]>>;
    setClaimApproval: React.Dispatch<React.SetStateAction<string[]>>;
    setFinalClaimApproval: React.Dispatch<React.SetStateAction<string | undefined>>;
    selectedNodeId: string | null;
    setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>
}

interface Employee {
    _id: string;
    email: string;
    name: string;
    position: string;
    employee_id: string;
    company: string;
    password: string;
    approvals: {
        trip_approval: number,
        claim_approval: number,
        workflow_approval: number,
    }
}

const WorkFlowModal: React.FC<WorkFlowModalProps> = ({
    isModalOpen,
    setIsModalOpen,
    setNodeData,
    setNodes,
    setInitiateTrip,
    setTripApproval,
    setClaimApproval,
    setFinalClaimApproval,
    setSelectedNodeId
}) => {

    const [employees, setEmployees] = useState<Employee[]>([]);

    function clickedNode() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    const [localNodeData, setLocalNodeData] = useState<NodeData[]>([]);

    const controlNode = (x: NodeData, id: string) => {
        setSelectedNodeId(id);
        setNodeData(x);
        clickedNode();
    }

    function doneModel() {

        localNodeData.map((data, index) => {

            setNodes((prevNodes) =>
                prevNodes.map((node) =>
                    node.id === data.user_id
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                userId: data.user_id,
                                label: data.label,
                                action: data.action,
                            },
                        }
                        : node
                )
            );

            const uniqueNodeId = `node-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`;

            const newNode = {
                id: uniqueNodeId,
                type: 'editableNode',
                position: { x: 200 + (index * 50), y: 200 + (index * 30) },
                data: {
                    userId: data.user_id,
                    label: data.label,
                    action: data.action,
                    controlNode: controlNode,
                },
            };

            setNodes(nds => [...nds, newNode]);

            if (data.action == 0) {
                setInitiateTrip(prev => [...prev, data.user_id!]);
            } else if (data.action == 1) {
                setTripApproval(prev => [...prev, data.user_id!]);
            } else if (data.action == 2) {
                setClaimApproval(prev => [...prev, data.user_id!]);
            } else if (data.action == 3) {
                setFinalClaimApproval(data.user_id!);
            }

        });
        setIsModalOpen(false);
    }

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/info/details`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setEmployees(result.users);
            } else {
                throw new Error(result.message || "Failed to fetch employees");
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : String(err));
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEmployeeSelection = (emp: Employee) => {
        setLocalNodeData((prev) => {
            const existingNode = prev.find((node) => node.user_id === emp._id);

            if (existingNode) {
                return prev.filter((node) => node.user_id !== emp._id);
            } else {
                return [...prev, { user_id: emp._id, label: emp.name, action: null }];
            }
        });
    };

    const handleActionChange = (userId: string, actionValue: number) => {
        setLocalNodeData((prev) =>
            prev.map((node) =>
                node.user_id === userId ? { ...node, action: actionValue } : node
            )
        );
    };


    return (
        <>
            {isModalOpen && (
                <div className="workflow-modal-overlay">
                    <div className="workflow-modal">
                        <button className="workflow-close-btn" onClick={closeModal}>X</button>
                        <button className="workflow-done-btn" onClick={doneModel}>Done</button>
                        <h3>Node Details</h3>
                        <div className="workflow-tab-content">
                            <div className="selected-employees">
                                <strong>Selected:</strong>
                                {localNodeData.length > 0 && localNodeData.map((data) => ` ${data.label} ${data.action}, `)}
                            </div>
                            <div className="workflow-blocks-container">
                                {employees &&
                                    employees.map((emp) => (
                                        <div
                                            key={emp._id}
                                            className="workflow-block-card"
                                            style={{
                                                cursor: "pointer",
                                                border: localNodeData.some((node) => node.user_id === emp._id)
                                                    ? "2px solid blue"
                                                    : "none",
                                            }}
                                        >
                                            <div className="workflow-block-row">
                                                <div onClick={() => handleEmployeeSelection(emp)} className="workflow-block-details">
                                                    <div><strong>Name:</strong> {emp.name}</div>
                                                    <div><strong>Position:</strong> {emp.position}</div>
                                                </div>

                                                <select
                                                    className="workflow-dropdown"
                                                    onChange={(e) => handleActionChange(emp._id, parseInt(e.target.value))}
                                                    value={localNodeData.find((node) => node.user_id === emp._id)?.action ?? ""}
                                                >
                                                    <option value="">Select Action</option>
                                                    <option value="0">Initiate Trip</option>
                                                    <option value="1">Trip Approval</option>
                                                    <option value="2">Claim Approval</option>
                                                    <option value="3">Final Claim Approval</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}


                            </div>
                        </div>


                    </div>
                </div>
            )}
        </>
    )
}

export default WorkFlowModal
