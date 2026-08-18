package com.agentmesh.agent_mesh.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Memory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String agentId;
    private LocalDateTime createdAt;

    public Memory() {}

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }

    public String getAgentId() {
        return agentId;
    }
    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }
    private String content;

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Memory(String content) {
    }
    public Long getId() {
        return id;
    }
    public Memory(String agentId, String content) {
        this.content = content;
        this.agentId = agentId;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
}
