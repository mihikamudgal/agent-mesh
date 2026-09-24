package com.agentmesh.agent_mesh.Controller;

import com.agentmesh.agent_mesh.Service.AgentIntercomm;
import com.agentmesh.agent_mesh.Service.AiAgentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/agent")
public class AiAgentController {

    private final AiAgentService aiService;
    private final AgentIntercomm agentIntercomm;
    public AiAgentController(AiAgentService aiService, AgentIntercomm agentIntercomm)
    {
        this.aiService = aiService;
        this.agentIntercomm= agentIntercomm;
    }
    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return aiService.ask(question);
    }
    @PostMapping("/assign")
    public String assign(
            @RequestParam String toAgent,
            @RequestParam String task) {

        return agentIntercomm.assignTask(
                toAgent,
                task
        );
    }
}
