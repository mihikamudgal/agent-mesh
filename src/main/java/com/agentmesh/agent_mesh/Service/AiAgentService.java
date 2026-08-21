package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import com.agentmesh.agent_mesh.Tools.Execution;
import com.agentmesh.agent_mesh.Tools.FileSystem;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

@Service
public class AiAgentService {
    private final ChatClient chatClient;
    private final MemoryService memoryService;
    private final AgentService agentService;
    private final FileSystem  fileSystem;
    private final Execution execution;

    public AiAgentService(ChatClient.Builder chatClientBuilder, MemoryService memoryService, AgentService agentService, FileSystem fileSystem ,  Execution execution) {
        this.chatClient = chatClientBuilder.build();
        this.memoryService = memoryService;
        this.agentService = agentService;
        this.fileSystem = fileSystem;
        this.execution = execution;
    }
    public String ask( String question){
        Agent agent = agentService.createAgent();

        String memories = memoryService.getMemories(agent.getId())
                .stream()
                .map(memory -> memory.getContent())
                .reduce("", (a, b) -> a + "\n" + b);

        String prompt = """
                     You are a coding agent.
                           Your identity:
                           Name: %s
                           Role: %s
                           Personality: %s
                           Here are some things you remember about the user:
                           %s
                   
                           User question:
                           %s
                           Answer according to your identity and use the memories when relevant.
                          
                       You can inspect and modify files in the workspace.
                       You can also run terminal commands to verify your work.
                
                       When completing a coding task:
                       1. Inspect the relevant files first.
                       2. Make the required changes.
                       3. Run appropriate tests or build commands.
                       4. If the command fails, inspect the error and fix the code.
                       5. Verify the result again.
                               """.formatted(
                                   agent.getName(),
                                   agent.getRole(),
                                   agent.getPersonality(),
                                   memories,
                                   question
                           );

        return chatClient
                .prompt(prompt)
                .tools(fileSystem, execution)
                .call()
                .content();
        }
}
