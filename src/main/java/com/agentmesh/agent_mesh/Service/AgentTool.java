package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Tools.AssignTask;
import com.agentmesh.agent_mesh.Tools.Execution;
import com.agentmesh.agent_mesh.Tools.FileSystem;
import org.springframework.stereotype.Service;

@Service
public class AgentTool {
    private final FileSystem fileSystem;
    private final Execution execution;
    private final AssignTask assignTask;

    public AgentTool(FileSystem fileSystem, Execution execution, AssignTask assignTask) {
        this.fileSystem = fileSystem;
        this.execution = execution;
        this.assignTask = assignTask;
    }

    public Object[] getTools(String agentId) {

        if (agentId.equals("software-agent")) {
            return new Object[]{
                    fileSystem,
                    execution,
                    assignTask
            };
        }
        if (agentId.equals("designer-agent")) {
            return new Object[]{
                    fileSystem
            };
        }
        if (agentId.equals("ops-agent")) {
            return new Object[]{
                    execution
            };
        }
        return new Object[]{};
    }
}
