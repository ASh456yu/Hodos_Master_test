import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Papa from 'papaparse'
import {
    ReactFlow,
    Background,
    useNodesState,
    useEdgesState,
    reconnectEdge,
    Connection,
    BaseEdge,
    Controls,
    MiniMap,
} from '@xyflow/react';
import { Upload, ChevronDown } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import './Workflow.css'
import { getBezierPath } from "@xyflow/react";
import { handleError, handleSuccess, handleWarn } from '../components/utils';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { EditableNode } from '../components/CustomNode'




const initialEdges: any[] = [];

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

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data, isSelected, setEdges }: any) => {
    const [condition, setCondition] = useState(data?.condition || "Enter condition");

    const edgeCenterX = (sourceX + targetX) / 2;
    const edgeCenterY = (sourceY + targetY) / 2;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCondition(event.target.value);
        setEdges((edges: any) =>
            edges.map((edge: any) =>
                edge.id === id ? { ...edge, data: { ...edge.data, condition: event.target.value } } : edge
            )
        );
    };

    const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            {isSelected && (
                <foreignObject x={edgeCenterX - 50} y={edgeCenterY - 20} width={100} height={40}>
                    <input
                        type="text"
                        value={condition}
                        onChange={handleChange}
                        style={{
                            width: "100px",
                            fontSize: "12px",
                            padding: "2px",
                            border: "1px solid gray",
                            borderRadius: "4px",
                            textAlign: "center",
                        }}
                    />
                </foreignObject>
            )}
        </>
    );
};


interface Workflow {
    _id: string;
    name: string;
    user: string;
    nodes: any[];
    edges: any[];
}

interface NodeData {
    user_id: string | null;
    label: string | null;
    action: number | null;
}

const FlowReact: React.FC = () => {
    const edgeReconnectSuccessful = useRef(true);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [workflowName, setWorkflowName] = useState("")
    const [workflowId, setWorkflowId] = useState("")
    const [isNewWorkflow, setIsNewWorkflow] = useState(true);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"employees" | "actions">("employees");
    const [initiateTrip, setInitiateTrip] = useState<string[]>([]);
    const [nodeData, setNodeData] = useState<NodeData>({
        user_id: null,
        label: null,
        action: null,
    });

    const [tripApproval, setTripApproval] = useState<string[]>([])
    const [claimApproval, setClaimApproval] = useState<string[]>([])
    const [finalClaimApproval, setFinalClaimApproval] = useState<string>()

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);


    function clickedNode() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function doneModel() {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === selectedNodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            userId: nodeData.user_id,
                            label: nodeData.label,
                            action: nodeData.action,
                        },
                    }
                    : node
            )
        );
        setNodeData({
            user_id: null,
            label: null,
            action: null,
        });
        const newNode = {
            id: `node-${Date.now()}`,
            type: 'editableNode',
            position: { x: 200, y: 200 },
            data: {
                userId: null,
                label: null,
                action: null,
                controlNode: controlNode
            },
        }
        setNodes((nds) => [...nds, newNode]);
        setIsModalOpen(false);
    }

    const controlNode = (x: NodeData, id: string) => {
        setSelectedNodeId(id);
        setNodeData(x)
        clickedNode()
    }

    const initialNodes: any[] = [
        {
            id: `node-${Date.now()}`,
            type: 'editableNode',
            position: { x: 200, y: 200 },
            data: {
                userId: nodeData.user_id,
                label: nodeData.label,
                action: nodeData.action,
                controlNode: controlNode
            },
        },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);



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

    const onConnect = useCallback((params: Connection) => {
        const newEdge = {
            ...params,
            id: `edge-${Date.now()}`,
            type: 'customEdge',
            data: { condition: 'Default Condition' }
        };

        setEdges((eds) => [...eds, newEdge]);
    }, [setEdges]);

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge: any, newConnection: Connection) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);


    const onReconnectEnd = useCallback((_: any, edge: { id: string; }) => {
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeReconnectSuccessful.current = true;
    }, []);

    const onNodeClick = (_: any, node: { id: string }) => {
        setSelectedNodeId(node.id);
    };

    const nodeTypes = useMemo(() => ({ editableNode: EditableNode }), []);
    const edgeTypes = useMemo(() => ({
        customEdge: (props: any) => (
            <CustomEdge
                {...props}
                setEdges={setEdges}
            />
        )
    }), [setEdges]);

    const saveWorkflow = async () => {
        if (workflowName.trim() === "") {
            handleError("Please provide a workflow name.");
            return;
        }

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

            setWorkflows(result.workflows);

        } catch (error) {
            handleError("Error Fetching Workflows")
        }
    }

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
        // console.log(workflow);
        
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
        setIsNewWorkflow(false)
        setIsDropdownOpen(false)
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
        fetchWorkflow()
    }, []);


    return (


        <div className="workflow-container">
            {/* Main content area */}
            <div className="workflow-content">
                {/* Left column - ReactFlow */}
                <div className="workflow-canvas">
                    <div className="canvas-card">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            snapToGrid
                            onNodeClick={onNodeClick}
                            onReconnect={onReconnect}
                            onReconnectStart={onReconnectStart}
                            onReconnectEnd={onReconnectEnd}
                            onConnect={onConnect}
                            fitView
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                        >
                            <Background />
                            <Controls />
                            <MiniMap />
                        </ReactFlow>
                    </div>
                </div>

                {/* Right column - Controls and Search */}
                <div className="workflow-sidebar">

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
                </div>
            </div>
            <ToastContainer />
            {isModalOpen && (
                <div className="workflow-modal-overlay">
                    <div className="workflow-modal">
                        <button className="workflow-close-btn" onClick={closeModal}>X</button>
                        <button className="workflow-done-btn" onClick={doneModel}>Done</button>
                        <h3>Node Details</h3>


                        <div className="workflow-tabs">
                            <button
                                className={`workflow-tab ${activeTab === "employees" ? "active" : ""}`}
                                onClick={() => setActiveTab("employees")}
                            >
                                Employees
                            </button>
                            <button
                                className={`workflow-tab ${activeTab === "actions" ? "active" : ""}`}
                                onClick={() => setActiveTab("actions")}
                            >
                                Actions
                            </button>
                        </div>

                        {/* Content */}
                        <div className="workflow-tab-content">
                            {activeTab === "employees" ? (
                                <div className="workflow-blocks-container">
                                    <h5>Current User: {nodeData.label ? nodeData.label : "No Employee Selected"}</h5>
                                    {employees.map((emp) => (
                                        <div
                                            key={emp._id}
                                            className="workflow-block-card"
                                            onClick={() =>
                                                setNodeData((prev) => ({
                                                    ...prev,
                                                    user_id: emp._id,
                                                    label: emp.name
                                                }))
                                            }
                                            style={{ cursor: "pointer", border: nodeData.user_id === emp._id ? "2px solid blue" : "none" }}
                                        >
                                            <div className="workflow-block-info">
                                                <div><strong>Name:</strong> {emp.name}</div>
                                                <div><strong>Position:</strong> {emp.position}</div>
                                                <div><strong>Trip Approval:</strong> {emp.approvals.trip_approval ? 'Yes' : 'No'}</div>
                                                <div><strong>Claim Approval:</strong> {emp.approvals.claim_approval ? 'Yes' : 'No'}</div>
                                                <div><strong>Workflow Approval:</strong> {emp.approvals.workflow_approval ? 'Yes' : 'No'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="workflow-action-container">
                                    <h5>Current Action: {
                                        nodeData.action != null ?
                                            nodeData.action == 0 ? "Trip Initiation" :
                                                nodeData.action == 1 ? "Trip Approval" :
                                                    nodeData.action == 2 ? "Claim Approval" :
                                                    nodeData.action == 3 ? "Final Claim Approval" :
                                                        <></> :
                                            "No Action Selected"}</h5>
                                    <div
                                        className="workflow-action-card"
                                        onClick={() => {
                                            if (!nodeData.user_id) {
                                                handleError("Please select an employee first");
                                                setActiveTab("employees");
                                                return;
                                            }
                                    
                                            setNodeData(prev => ({ ...prev, action: 0 }));
                                            
                                            setInitiateTrip(prev => {
                                                if (prev.includes(nodeData.user_id!)) {
                                                    return prev;
                                                }
                                                return [...prev, nodeData.user_id!];
                                            });
                                    
                                        }}
                                    >
                                        Trip Initiation
                                    </div>
                                    <div
                                        className="workflow-action-card"
                                        onClick={() => {
                                            setNodeData((prev) => ({ ...prev, action: 1 }))
                                            if (!nodeData.user_id) {
                                                handleError("Please select an employee first");
                                                setActiveTab("employees");
                                                return;
                                            }
                                    
                                            setNodeData((prev) => ({ ...prev, action: 1 }))
                                            
                                            setTripApproval(prev => {
                                                if (prev.includes(nodeData.user_id!)) {
                                                    return prev;
                                                }
                                                return [...prev, nodeData.user_id!];
                                            });
                                        }
                                        }
                                    >
                                        Trip Approval
                                    </div>
                                    <div
                                        className="workflow-action-card"
                                        onClick={() => 
                                            {
                                                if (!nodeData.user_id) {
                                                    handleError("Please select an employee first");
                                                    setActiveTab("employees");
                                                    return;
                                                }
                                        
                                                setNodeData((prev) => ({ ...prev, action: 2 }))
                                                
                                                setClaimApproval(prev => {
                                                    if (prev.includes(nodeData.user_id!)) {
                                                        return prev;
                                                    }
                                                    return [...prev, nodeData.user_id!];
                                                });
                                            }
                                        }
                                    >
                                        Claim Approval
                                    </div>
                                    <div
                                        className="workflow-action-card"
                                        onClick={() => 
                                            {
                                                if (!nodeData.user_id) {
                                                    handleError("Please select an employee first");
                                                    setActiveTab("employees");
                                                    return;
                                                }
                                        
                                                setNodeData((prev) => ({ ...prev, action: 3 }))
                                                
                                                setFinalClaimApproval(nodeData.user_id);
                                            }
                                        }
                                    >
                                        Final Claim Approval
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default FlowReact;
