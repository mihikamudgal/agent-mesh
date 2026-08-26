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
}
