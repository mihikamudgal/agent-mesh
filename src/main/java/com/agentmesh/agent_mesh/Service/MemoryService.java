package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Memory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MemoryService {
    private final List<Memory> memories = new ArrayList<>();

    public void addMemory(String content) {
        memories.add(new Memory(content));
    }
    public List<Memory> getMemories() {
        return memories;
    }
}





