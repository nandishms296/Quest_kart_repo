import { Handle, Position } from "reactflow";

const TaskNode = ({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div
        dangerouslySetInnerHTML={{ __html: data.label }}
        style={{
          backgroundColor: "white",
          padding: "0.4rem 1rem",
          borderRadius: "4px",
          fontSize: "10px",
        }}
      />
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

export default TaskNode;
