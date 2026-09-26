package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import com.agentmesh.agent_mesh.Tools.Execution;
import com.agentmesh.agent_mesh.Tools.FileSystem;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AgentExe {
    private final ChatClient chatClient;
    private final AgentPrompt agentPrompt;
    private final MemoryService memoryService;
    private final FileSystem fileSystem;
    private final Execution execution;
    private final AgentTool agentTool;

    public AgentExe( ChatClient.Builder chatClientBuilder, AgentPrompt agentprompt, MemoryService memoryService, FileSystem fileSystem, Execution execution,  AgentTool agentTool ) {
        this.chatClient = chatClientBuilder.build();
        this.agentPrompt = agentprompt;
        this.memoryService = memoryService;
        this.fileSystem = fileSystem;
        this.execution = execution;
        this.agentTool = agentTool;
    }

    public String execute(Agent agent, String question, Object... additionalTools) {

        String memories = memoryService.getMemories(agent.getId())
                .stream()
                .map(memory -> memory.getContent())
                .reduce("", (a, b) -> a + "\n" + b);

        String prompt = agentPrompt.buildPrompt(
                agent,
                memories,
                question
        );
        Object[] baseTools = agentTool.getTools(agent.getId());
        Object[] tools = new Object[
                baseTools.length + additionalTools.length
                ];
        System.arraycopy(
                baseTools,
                0,
                tools,
                0,
                baseTools.length
        );
        System.arraycopy(
                additionalTools,
                0,
                tools,
                baseTools.length,
                additionalTools.length
        );
        return chatClient.prompt(prompt)
                .tools(tools)
                .call()
                .content();
    }
    }
