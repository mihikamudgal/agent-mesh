package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import org.springframework.stereotype.Service;

@Service
public class AgentIntercomm {
    private final AgentManager agentManager;
    private final AiAgentService aiAgentService;
    public AgentIntercomm(
            AgentManager agentManager,
            AiAgentService aiAgentService) {

        this.agentManager = agentManager;
        this.aiAgentService = aiAgentService;
    }
    public String sendTask(String fromAgent, String toAgent, String task) {
        Agent targetAgent = agentManager.route(toAgent);
        if (targetAgent == null) {
            return "Required agent was not found";
        }

        return aiAgentService.askAsAgent(targetAgent, task);
    }

}
