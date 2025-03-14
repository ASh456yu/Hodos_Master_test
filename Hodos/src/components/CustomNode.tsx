import { Handle, Position } from '@xyflow/react';
import '../styles/CustomNode.css'
import { memo } from 'react';

interface NodeData {
    user_id: string | null,
    label: string | null,
    action: number | null,
}

const EditableNode = memo(({ id, data }: {
    id: string,
    data: {
        userId: string;
        label: string;
        action: number | null;
        controlNode?: (data: NodeData, id: string) => void;
    }
}) => {

    function clickedNode(): void {
        if (data.controlNode) {
            const tempdata = {
                user_id: data.userId,
                label: data.label,
                action: data.action,
            };
            data.controlNode(tempdata, id);
        }
    }

    return (
        <>
            {data.action !== null ? (
                <div className="node-container" onClick={() => clickedNode()}>
                    <div className="node-title">
                        <strong>{data.label}</strong>
                        {data.action === 0 ? <p>Trip Initiation</p> :
                            data.action === 1 ? <p>Trip Approval</p> :
                                data.action === 2 ? <p>Claim Approval</p> : <p>Final Claim Approval</p>}
                    </div>

                    {/* Handles */}
                    {data.action === 0 ? (
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id="output-1"
                            className="handle-source"
                            style={{ backgroundColor: 'red' }}
                        />
                    ) : data.action === 1 || data.action === 2 ? (
                        <>
                            <Handle
                                type="target"
                                position={Position.Top}
                                id="input-1"
                                className='handle-source'
                                style={{ backgroundColor: 'blue' }}
                            />
                            <Handle
                                type="source"
                                position={Position.Bottom}
                                id="output-1"
                                className="handle-source"
                                style={{ left: '30%', backgroundColor: 'red' }}
                            />
                            <Handle
                                type="source"
                                position={Position.Bottom}
                                id="output-2"
                                className="handle-source"
                                style={{ left: '70%', backgroundColor: 'green' }}
                            />
                        </>
                    ) : (
                        <Handle
                            type="target"
                            position={Position.Top}
                            id="input-1"
                            className='handle-source'
                            style={{ backgroundColor: 'blue' }}
                        />
                    )}
                </div>
            ) : (
                <div className='empty-node' onClick={() => clickedNode()} />
            )}
        </>
    );
});

export { EditableNode };