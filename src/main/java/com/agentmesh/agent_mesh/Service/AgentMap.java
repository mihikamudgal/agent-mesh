package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AgentMap {
    private final Map<String, Agent> agents = new HashMap<>();
    public AgentMap() {
        register(new Agent(
                "software-agent",
                "AgentCoder",
                "Software Developer",
                "Helpful, practical and concise"
        ));
        register(new Agent(
                "designer-agent",
                "DesignerAgent",
                "Software Designer",
                "Creative, structured and detail-oriented"
        ));
        register(new Agent(
                "ops-agent",
                "OpsAgent",
                "DevOps Engineer",
                "Reliable, systematic and security-conscious"
        ));
    }

    public void register(Agent agent) {
        agents.put(agent.getId(), agent);
    }
    public Agent getAgent(String agentId) {
        return agents.get(agentId);
    }
    public Map<String, Agent> getAllAgents() {
        return agents;
    }
}
