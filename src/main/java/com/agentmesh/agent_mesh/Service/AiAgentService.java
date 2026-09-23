package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import com.agentmesh.agent_mesh.Tools.Execution;
import com.agentmesh.agent_mesh.Tools.FileSystem;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiAgentService {
    private final ChatClient chatClient;
    private final MemoryService memoryService;
    private final AgentService agentService;
    private final FileSystem fileSystem;
    private final Execution execution;
    private final AgentManager agentManager;
    private final AgentPrompt agentPrompt;
    private final AgentTool agentTool;

    public AiAgentService(ChatClient.Builder chatClientBuilder, MemoryService memoryService, AgentService agentService, FileSystem fileSystem, Execution execution, AgentManager agentManager, AgentPrompt agentPrompt, AgentTool agentTool) {
        this.chatClient = chatClientBuilder.build();
        this.memoryService = memoryService;
        this.agentService = agentService;
        this.fileSystem = fileSystem;
        this.execution = execution;
        this.agentManager = agentManager;
        this.agentPrompt = agentPrompt;
        this.agentTool = agentTool;
    }

    public String ask(String question) {
        Agent agent = agentManager.routeByTask(question);

        if (agent == null) {
            return "Agent not found";
        }
        String memories = memoryService.getMemories(agent.getId())
                .stream()
                .map(memory -> memory.getContent())
                .reduce("", (a, b) -> a + "\n" + b);

        String prompt = agentPrompt.buildPrompt(
                agent,
                memories,
                question
        );

        Object[] tools = agentTool.getTools(agent.getId());
        return chatClient
                .prompt(prompt)
                .tools(tools)
                .call()
                .content();
    }
}