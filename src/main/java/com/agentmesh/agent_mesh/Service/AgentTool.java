package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Tools.Execution;
import com.agentmesh.agent_mesh.Tools.FileSystem;
import org.springframework.stereotype.Service;

@Service
public class AgentTool {
    private final FileSystem fileSystem;
    private final Execution execution;

    public AgentTool(FileSystem fileSystem, Execution execution) {
        this.fileSystem = fileSystem;
        this.execution = execution;
    }
    public Object[] getTools(String agentId) {
        if (agentId.equals("software-agent")) {
            return new Object[]{
                    fileSystem,
                    execution
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

