import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Node, Edge, OnNodesChange, OnEdgesChange, Background, Connection, Controls, MiniMap, ReactFlow, BaseEdge, getBezierPath, reconnectEdge } from '@xyflow/react';
import { EditableNode } from '../components/CustomNode';

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

interface WorkflowMainProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange<any>;
    onEdgesChange: OnEdgesChange<any>;
    setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const WorkflowMain: React.FC<WorkflowMainProps> = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setSelectedNodeId,
    setEdges
}) => {

    const edgeReconnectSuccessful = useRef(true);

    const onNodeClick = (_: any, node: { id: string }) => {
        setSelectedNodeId(node.id);
    };

    const onReconnect = useCallback((oldEdge: any, newConnection: Connection) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

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


    const onReconnectEnd = useCallback((_: any, edge: { id: string; }) => {
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeReconnectSuccessful.current = true;
    }, []);

    const nodeTypes = useMemo(() => ({ editableNode: EditableNode }), []);
    const edgeTypes = useMemo(() => ({
        customEdge: (props: any) => (
            <CustomEdge
                {...props}
                setEdges={setEdges}
            />
        )
    }), [setEdges]);


    return (
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
    )
}

export default WorkflowMain


