package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiAgentService {
    private final AgentManager agentManager;
    private final AgentExe agentExe;
    public AiAgentService(
            AgentManager agentManager,
            AgentExe agentExe) {

        this.agentManager = agentManager;
        this.agentExe = agentExe;
    }
    public String ask(String question) {
        Agent agent = agentManager.routeByTask(question);

        if (agent == null) {
            return "Agent was not found";
        }
        return agentExe.execute(agent, question);
    }
}
