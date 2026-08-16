package com.agentmesh.agent_mesh.Controller;

import com.agentmesh.agent_mesh.Service.AiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/agent")
public class AiController {

    private final AiService aiService;
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }
    @GetMapping("/ask")
    public String askAgent(@RequestParam String question) {

        return aiService.askAgent(question);
    }
}
