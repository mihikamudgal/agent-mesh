package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import org.springframework.stereotype.Service;

@Service
public class AgentService {
    public Agent createAgent() {

        return new Agent(
                "software-agent-01",
                "CodeMaster",
                "Software Developer",
                "Helpful, practical and concise"
        );
    }
}
