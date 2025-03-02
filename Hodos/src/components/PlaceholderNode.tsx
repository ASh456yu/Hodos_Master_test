import { Handle, Position } from "@xyflow/react";


const PlaceholderNode = ({ data }: {
    data: {
        label: string;
    }
}) => {
  return (
    <div className="node-container">
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default PlaceholderNode;
