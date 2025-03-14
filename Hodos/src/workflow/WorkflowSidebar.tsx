import { ChevronDown, Upload } from 'lucide-react';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react'
import { handleSuccess, handleError, handleWarn } from '../components/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import axios from 'axios';
import { Node, Edge } from '@xyflow/react';
import UnauthorizedUserView from '../unauthorized/UnauthorizedUserView';


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

interface Workflow {
    _id: string;
    name: string;
    user: string;
    nodes: any[];
    edges: any[];
}

interface WorkflowSidebarProps {
    nodes: Node[];
    edges: Edge[];
    initiateTrip: string[];
    tripApproval: string[];
    claimApproval: string[];
    finalClaimApproval: string | undefined;
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
    nodes,
    edges,
    initiateTrip,
    tripApproval,
    claimApproval,
    finalClaimApproval,
    setNodes,
    setEdges
}) => {

    const { user } = useSelector((state: RootState) => state.auth);
    const [workflowName, setWorkflowName] = useState("")
    const [workflowId, setWorkflowId] = useState("")
    const [isNewWorkflow, setIsNewWorkflow] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [workflows, setWorkflows] = useState<Workflow[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse<Employee>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                if (!user.company) {
                    console.error("Company is not set");
                    return;
                }
                const dup = result.data;

                try {
                    const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/auth/upload`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: 'include',
                        body: JSON.stringify({ users: dup }),
                    });

                    const result = await response.json();
                    if (result.success) {
                        handleSuccess("Users saved successfully:");
                    } else {
                        handleError("Error saving users:");
                    }
                } catch (error) {
                    handleError("Error during upload:");
                }
            },
            error: (error) => {
                handleError(`Error while parsing ${error}`);
            },
        });
    };

    const fetchWorkflow = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/general/fetch-workflow`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                handleError(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json()
            if (response.ok) {
                handleWorkflowClick(result.workflows[0]);
                setWorkflows(result.workflows);
            }
            

        } catch (error) {
            handleError("Error Fetching Workflows")
        }
    };

    const saveWorkflow = async () => {
        if (workflowName.trim() === "") {
            handleError("Please provide a workflow name.");
            return;
        };

        try {
            const payload = {
                name: workflowName,
                nodes,
                edges,
                initiateTrip,
                tripApproval,
                claimApproval,
                finalClaimApproval
            };

            const response = await axios.post(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/general/save-workflow`, payload, {
                withCredentials: true,
            });

            if (response.data.success) {
                handleSuccess("Workflow saved successfully!");
                fetchWorkflow();
            }
        } catch (error) {
            handleError("Error saving workflow");
        }
    };

    const updateWorkflow = async () => {
        if (!workflowId || workflowName.trim() === "") {
            handleError("Please provide a workflow name.");
            return;
        }

        try {
            const payload = {
                workflowId,
                name: workflowName,
                nodes,
                edges
            };

            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/general/update-workflow`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                handleSuccess("Workflow updated successfully!");
                fetchWorkflow();
            } else {
                handleError(result.message);
            }
        } catch (error) {
            handleError("Error updating workflow");
        }
    };

    const handleWorkflowClick = (workflow: any) => {

        setNodes(workflow.nodes);

        const formattedEdges = workflow.edges.map((edge: any) => ({
            ...edge,
            id: edge.id || `edge-${Date.now()}-${Math.random()}`,
            sourceHandle: edge.sourceHandle || 'output-1',
            targetHandle: edge.targetHandle || 'input-1',
            type: 'customEdge'
        }));
        setEdges(formattedEdges);
        setWorkflowName(workflow.name);
        setWorkflowId(workflow._id);
        setIsNewWorkflow(false);
        setIsDropdownOpen(false);
    };

    const deleteWorkflow = async () => {
        if (workflowId === "") {
            handleWarn("Please select or create a workflow")
            return
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/general/delete-workflow/${workflowId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                handleError(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                handleSuccess("workflow deleted successfully")
                setWorkflows(workflows?.filter(workflow => workflow._id !== workflowId));
            }
        } catch (error) {
            console.error("Error deleting workflow");
        }
    };

    useEffect(() => {
        fetchWorkflow()
    }, []);



    return (
        <div className="workflow-sidebar">

            {user && user.isAuthorized ? <>

                {/* Workflow Controls */}
                <div className="sidebar-card">
                    <div className="workflow-controls">
                        <div className="control-header">
                            <div className="input-group">
                                <label>Workflow Name</label>
                                <input
                                    type="text"
                                    value={workflowName}
                                    onChange={(e) => setWorkflowName(e.target.value)}
                                />
                            </div>
                            <div>
                                <button
                                    className="dropdown-trigger"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    Actions <ChevronDown className="flow-icon" />
                                </button>
                                {isDropdownOpen && (
                                    <ul>
                                        {workflows.length > 0 ? (
                                            workflows.map((workflow) => (
                                                <li
                                                    key={workflow._id}
                                                    onClick={() => handleWorkflowClick(workflow)}
                                                    className="dropdown-item"
                                                >
                                                    {workflow.name}
                                                </li>
                                            ))
                                        ) : (
                                            <p className="flow-no-workflow">No workflows available</p>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="button-group">
                            <button className="button-danger" onClick={deleteWorkflow}>Delete</button>
                            <button className="button-primary" onClick={isNewWorkflow ? saveWorkflow : updateWorkflow}>
                                {isNewWorkflow ? 'Save' : 'Update Workflow'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Blocks */}
                <div className="sidebar-card">
                    {/* Add Member Section */}
                    <div className="workflow-card">
                        <div className="workflow-card-content">
                            <h2 className="workflow-section-title">Add Member</h2>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                id="fileInput"
                            />
                            <button className="workflow-button workflow-button-primary" onClick={() => document.getElementById('fileInput')?.click()}>
                                <Upload className="workflow-icon" />
                                Upload CSV
                            </button>
                        </div>
                    </div>
                </div>
            </> : <>
                <UnauthorizedUserView
                    description='This workflow management system allows authorized users to create, save, and manage custom workflows.'
                    features={['Create custom workflows', 'Import members via CSV', 'Manage team collaboration']}
                />
            </>
            }
        </div>
    )
}

export default WorkflowSidebar
