package com.agentmesh.agent_mesh.Controller;

import com.agentmesh.agent_mesh.Service.AiAgentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/agent")
public class AiAgentController {

    private final AiAgentService aiService;
    public AiAgentController(AiAgentService aiService)
    {
        this.aiService = aiService;
    }
    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return aiService.ask(question);
    }
}
