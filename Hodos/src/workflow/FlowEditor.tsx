import React, { useState } from 'react';
import {
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles/Workflow.css'
import { ToastContainer } from 'react-toastify';
import WorkFlowModal from './WorkFlowModal';
import WorkflowSidebar from './WorkflowSidebar';
import WorkflowMain from './WorkflowMain';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';



const initialEdges: any[] = [];

interface NodeData {
    user_id: string | null;
    label: string | null;
    action: number | null;
}

const FlowReact: React.FC = () => {
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initiateTrip, setInitiateTrip] = useState<string[]>([]);
    const [nodeData, setNodeData] = useState<NodeData>({ user_id: null, label: null, action: null });
    const [tripApproval, setTripApproval] = useState<string[]>([]);
    const [claimApproval, setClaimApproval] = useState<string[]>([]);
    const [finalClaimApproval, setFinalClaimApproval] = useState<string>();
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);

    function clickedNode() {
        setIsModalOpen(true);
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

    return (


        <div className="workflow-container">
            {/* Main content area */}
            <div className="workflow-content">
                {/* Left column - ReactFlow */}
                <WorkflowMain
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    setSelectedNodeId={setSelectedNodeId}
                    setEdges={setEdges}
                />

                {/* Right column - Controls and Search */}
                <WorkflowSidebar
                    nodes={nodes}
                    edges={edges}
                    initiateTrip={initiateTrip}
                    tripApproval={tripApproval}
                    claimApproval={claimApproval}
                    finalClaimApproval={finalClaimApproval}
                    setNodes={setNodes}
                    setEdges={setEdges}
                />

                <WorkFlowModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    nodeData={nodeData}
                    setNodeData={setNodeData}
                    nodes={nodes}
                    setNodes={setNodes}
                    setInitiateTrip={setInitiateTrip}
                    setTripApproval={setTripApproval}
                    setClaimApproval={setClaimApproval}
                    setFinalClaimApproval={setFinalClaimApproval}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                />
            </div>
            <ToastContainer />

        </div>
    );
}

export default FlowReact;
