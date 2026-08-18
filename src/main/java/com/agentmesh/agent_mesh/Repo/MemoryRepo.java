package com.agentmesh.agent_mesh.Repo;
import com.agentmesh.agent_mesh.Model.Memory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemoryRepo extends JpaRepository<Memory, Long> {
    List<Memory> findByAgentId(String agentId);

}
