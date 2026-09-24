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

    public AgentExe( ChatClient.Builder chatClientBuilder, AgentPrompt agentprompt, AgentTool agenttool, MemoryService memoryService, FileSystem fileSystem, Execution execution ) {
        this.chatClient = chatClientBuilder.build();
        this.agentPrompt = agentprompt;
        this.memoryService = memoryService;
        this.fileSystem = fileSystem;
        this.execution = execution;
    }

    public String execute(Agent agent, String question) {

        String memories = memoryService.getMemories(agent.getId())
                .stream()
                .map(memory -> memory.getContent())
                .reduce("", (a, b) -> a + "\n" + b);

        String prompt = agentPrompt.buildPrompt(
                agent,
                memories,
                question
        );

        Object[] tools;

       if (agent.getId().equals("software-agent")) {
            tools = new Object[]{
                    fileSystem,
                    execution
            };
        } else if (agent.getId().equals("designer-agent")) {
            tools = new Object[]{
                    fileSystem
            };
        } else if (agent.getId().equals("ops-agent")) {
            tools = new Object[]{
                    execution
            };
        } else {
            tools = new Object[]{};
        }
        return chatClient.prompt(prompt)
                .tools(tools)
                .call()
                .content();
    }
    }
