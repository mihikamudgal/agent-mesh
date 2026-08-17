package com.agentmesh.agent_mesh.Controller;

import com.agentmesh.agent_mesh.Model.Memory;
import com.agentmesh.agent_mesh.Service.MemoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/memory")

public class MemoryController {
    private final MemoryService memoryService;
    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }
    @PostMapping
    public Memory addMemory(@RequestBody String content) {
        return memoryService.addMemory(content);
    }
    @GetMapping
    public List<Memory> getMemories() {
        return memoryService.getMemories();
     }

}
