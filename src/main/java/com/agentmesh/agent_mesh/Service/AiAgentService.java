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
                
                For coding tasks, you MUST perform the task using your tools.
                
                Workflow:
                
                1. Inspect the project using listFiles/searchFiles when necessary.
                2. Read relevant files before modifying them.
                3. Make code changes using writeFile or editFile.
                4. Run tests or build commands using runTests or runCommand.
                5. If a command fails:
                   - Read the error carefully.
                   - Read the relevant source file.
                   - Identify the exact cause.
                   - Use editFile to actually fix the source code.
                   - Do NOT merely describe the fix.
                6. Run the failed command again after making the fix.
                7. Repeat steps 5-6 until the relevant verification succeeds.
                8. Use gitDiff to inspect the final changes.
                9. Only then provide the final response.
                
                IMPORTANT:
                When the user asks you to fix something, explaining how to fix it is NOT completing the task.
                You must actually modify the files using the available tools.
                
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
