package com.agentmesh.agent_mesh.Controller;

import com.agentmesh.agent_mesh.Model.Agent;
import com.agentmesh.agent_mesh.Service.AgentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AgentController {
    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping("/agent")
    public Agent getAgent() {
        return agentService.createAgent();
    }
}
