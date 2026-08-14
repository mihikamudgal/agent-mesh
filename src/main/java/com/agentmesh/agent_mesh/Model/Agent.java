package com.agentmesh.agent_mesh.Model;

public class Agent {
    private String id;
    private String name;
    private String role;
    private String personality;

    public Agent() {}

    public String getPersonality() {
        return personality;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setPersonality(String personality) {
        this.personality = personality;
    }

    public Agent(String id, String name, String role, String personality) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.personality = personality;
    }
}
