package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Memory;
import com.agentmesh.agent_mesh.Repo.MemoryRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemoryService {
    private final MemoryRepo memoryRepo;
    public MemoryService(MemoryRepo memoryRepo) {
        this.memoryRepo = memoryRepo;
    }
    public Memory addMemory(String agentId, String content) {
        Memory memory = new Memory(agentId, content);
        return memoryRepo.save(memory);
    }
    public List<Memory> getMemories(String agentId) {
        return memoryRepo.findByAgentId(agentId);
    }
}





