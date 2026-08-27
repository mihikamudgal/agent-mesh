package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import org.springframework.stereotype.Service;

@Service
public class AgentManager{
    private final AgentMap agentMap;
    public AgentManager(AgentMap agentMap) {
                this.agentMap = agentMap;
    }
    public Agent route(String agentId) {
        Agent agent = agentMap.getAgent(agentId);
        if (agent == null) {
            throw new IllegalArgumentException("Agent not found:" + agentId
            );
        }
        return agent;
    }
    public Agent routeByTask(String question) {
       String task = question.toLowerCase();
           if (task.contains("design")
                || task.contains("architecture")
                || task.contains("system design")
                || task.contains("database design")) {

            return agentMap.getAgent("designer-agent-01");
        }
      if (task.contains("deploy")
                || task.contains("deployment")
                || task.contains("docker")
                || task.contains("server")
                || task.contains("devops")) {
            return agentMap.getAgent("ops-agent-01");
        }
        return agentMap.getAgent("software-agent-01");
    }
}
