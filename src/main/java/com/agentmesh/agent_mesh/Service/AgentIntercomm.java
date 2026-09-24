package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import org.springframework.stereotype.Service;

@Service
public class AgentIntercomm {

    private final AgentManager agentManager;
    private final AgentExe agentExe;

    public AgentIntercomm(
            AgentManager agentManager,
            AgentExe agentExe) {

        this.agentManager = agentManager;
        this.agentExe = agentExe;
    }
    public String assignTask(String toAgent, String task) {
        Agent targetAgent = agentManager.route(toAgent);
        return agentExe.execute(
                targetAgent,
                task
        );
    }
}
