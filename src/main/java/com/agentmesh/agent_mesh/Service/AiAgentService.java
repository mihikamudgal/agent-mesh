package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import com.agentmesh.agent_mesh.Tools.AssignTask;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiAgentService {
    private final AgentManager agentManager;
    private final AgentExe agentExe;
    private final AgentIntercomm agentIntercomm;
    private final AssignTask assignTask;

    public AiAgentService(
            AgentManager agentManager, AgentExe agentExe, AgentIntercomm agentIntercomm,  AssignTask assignTask) {
        this.agentManager = agentManager;
        this.agentExe = agentExe;
        this.agentIntercomm = agentIntercomm;
        this.assignTask = assignTask;
    }

    public String ask(String question) {
        Agent agent = agentManager.routeByTask(question);

        if (agent == null) {
            return "Agent was not found";
        }
        if (agent.getId().equals("software-agent")) {
            return agentExe.execute(
                    agent,
                    question,
                    assignTask
            );
        }
        return agentExe.execute(agent, question);
    }
    public String delegate(String toAgent, String task) {
        return agentIntercomm.assignTask(
                toAgent,
                task
        );
    }
}
