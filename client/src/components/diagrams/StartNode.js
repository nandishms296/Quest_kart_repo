import { Handle, Position } from "reactflow";

const StartNode = ({ isConnectable }) => {
  return (
    <>
      <div>
        <strong>Start</strong>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ bottom: "-4px", top: "auto", background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default StartNode;
