export const handleToolCalls = async (tool_calls) => {
  return Promise.all(
    tool_calls.map(async (call) => {
      const { id, function: func, arguments: args } = call;
      let output;

      try {
        // Dynamically call the function based on the function name
        if (typeof global[func.name] === "function") {
          output = await global[func.name](JSON.parse(args));
        } else {
          output = { error: `Unknown function: ${func.name}` };
        }
      } catch (error) {
        output = { error: `Error executing ${func.name}: ${error.message}` };
      }

      return { tool_call_id: id, output: JSON.stringify(output) };
    })
  );
};
