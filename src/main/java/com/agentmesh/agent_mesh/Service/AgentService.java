package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import org.springframework.stereotype.Service;

@Service
public class AgentService {
    private final AgentMap agentMap;
    public AgentService(AgentMap agentMap) {
        this.agentMap = agentMap;
    }
    public Agent createAgent() {
      return agentMap.getAgent("software-agent-01");
    }

    public Agent getAgent(String agentId) {
        return agentMap.getAgent(agentId);
    }
}
