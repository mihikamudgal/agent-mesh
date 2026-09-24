package com.agentmesh.agent_mesh.Tools;

import com.agentmesh.agent_mesh.Service.AgentIntercomm;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
public class AssignTask {
    private final AgentIntercomm agentIntercomm;

    public AssignTask(AgentIntercomm agentIntercomm) {
        this.agentIntercomm = agentIntercomm;
    }

    @Tool(description = """
            Delegate a task to another specialized agent.
            
            designer-agent handles system architecture, database design,
            API architecture and technical design.
            
            ops-agent handles Docker, deployment, infrastructure,
            CI/CD and DevOps.
            
            Use this tool when another agent's specialized expertise is required.
            """)
    public String assignTask(String toAgent, String task) {

        return agentIntercomm.assignTask(
                toAgent,
                task
        );
}
}