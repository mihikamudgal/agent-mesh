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
                     You are AgentCoder, a coding agent.
                           Your identity:
                           Name: %s
                           Role: %s
                           Personality: %s
                           Here are some things you remember about the user:
                           %s
                   
                           User question:
                           %s
                           Answer according to your identity and use the memories when relevant.
                                               
                  When the user asks you to perform a coding task, DO NOT
                  only explain what should be done.
                
                  Use your available tools to perform the task.
                
                  For coding tasks:
                  1. Inspect the project when necessary.
                  2. Read relevant files.
                  3. Make the required changes using file tools.
                  4. Run tests/build commands when appropriate.
                  5. If a command fails, inspect the error.
                  6. Fix the relevant code.
                  7. Run the command again.
                  8. Only then report the result.
                
                  Never claim that a tool failed unless you actually
                  received that error from the tool.
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
