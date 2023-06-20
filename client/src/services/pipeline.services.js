function traverseNodeTree(node, edges, visited = new Set()) {
  if (visited.has(node.target)) {
    // Cyclic loop detected
    return false;
  }

  visited.add(node.target);

  // Process the current node
  console.log(node.target);
  let nextNodes = edges.filter((edge) => edge.source === node.target);
  if (nextNodes.length > 0) {
    for (const nextNode of nextNodes) {
      const status = traverseNodeTree(nextNode, edges, visited);
      if (!status) return false;
    }
  }

  visited.delete(node.target);
  return true;
}

export async function convertEdges2NodeSequence(edges) {
  let startingNodes = edges.filter((node) => node.source === "0");
  if (startingNodes.length < edges.length) {
    for (const node of startingNodes) {
      startingNodes["status"] = traverseNodeTree(node, edges);
      console.log("node: ", node);
      if (!startingNodes["status"])
        return {
          status: "error",
          message:
            "Pipeline flow contains cyclic loop. Invalid sequence of Tasks.",
        };
    }

    console.log("Starting Nodes: ", startingNodes);
  } else if (startingNodes.lenght > edges.length) {
    return {
      status: "error",
      message:
        "Error: No of edges starting from start nodes can't be greater than total no. of tasks in pipeline flow.",
    };
  }
  /*     const newEdges = edges.map((edge) => {
      return { id: edge.id, source: edge.source, target: edge.target };
    }); */
  let grouped = {};
  edges.forEach(({ source, target }) => {
    grouped[target] = grouped[target] || { id: target, task_sequence: [] };
    if (!grouped[target].task_sequence.includes(source))
      grouped[target].task_sequence.push("".concat('"', source, '"'));
  });

  grouped = Object.values(grouped);

  console.log(grouped);

  const taskSequence = grouped.map((edge) => {
    return { id: edge.id, task_sequence: edge.task_sequence.join(", ") };
  });
  console.log("Node Sequences: ", taskSequence);

  return { status: "success", message: "", data: taskSequence };
}
