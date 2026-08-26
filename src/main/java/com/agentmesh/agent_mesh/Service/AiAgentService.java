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
    private final FileSystem  fileSystem;
    private final Execution execution;

    public AiAgentService(ChatClient.Builder chatClientBuilder, MemoryService memoryService, AgentService agentService, FileSystem fileSystem ,  Execution execution) {
        this.chatClient = chatClientBuilder.build();
        this.memoryService = memoryService;
        this.agentService = agentService;
        this.fileSystem = fileSystem;
        this.execution = execution;
    }
    public String ask(String agentId, String question){
        Agent agent = agentService.getAgent(agentId);

        if(agent == null){
            return "Agent not found" + agentId ;
        }


        String memories = memoryService.getMemories(agent.getId())
                .stream()
                .map(memory -> memory.getContent())
                .reduce("", (a, b) -> a + "\n" + b);

        String prompt = """
                You are %s.
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
                For coding tasks, follow this workflow:
                
                1. Understand the user's requested change.
                2. Inspect the project structure when necessary.
                3. Read the relevant files before modifying them.
                4. Make the required changes using the available file tools.
                5. Run tests or build commands to verify the changes.
                6. If the command fails
                     - Read the error carefully.
                   - Read the relevant source file.
                   - Identify the exact cause.
                   - Use editFile to actually fix the source code.
                   - Do NOT merely describe the fix.
                7. Fix the underlying problem using the available tools.
                8. Run the verification command again.
                9. Repeat until the task is successfully verified or
                   you have a genuine blocking problem.
                10. Only report success after verification succeeds.
                
                Never claim that a change was made unless you actually
                used a tool to make the change.
                Never claim that tests passed unless you actually ran them.
                Never stop at identifying an error when you are capable
                of fixing it.
                
                VERIFICATION RULE:
                
                After making changes:
                1. Use gitDiff to inspect the actual changes.
                2. Only report files as changed if the tool output confirms they were changed.
                3. Never infer task-related files from filenames or assumptions.
                4. Run tests using runTests.
                5. Never claim tests passed unless runTests actually returned success.
                
                PROJECT STRUCTURE RULE:
                
                Before creating a new file:
                1. Inspect the existing project structure using listFiles.
                2. Identify the existing root package and relevant package structure.
                3. Read relevant existing classes to understand the project's architecture.
                4. Place new files inside the appropriate existing package.
                5. Follow the project's existing naming and package conventions.
                6. Never invent a new root package or generic package structure.
                7. Never assume a file path when listFiles or searchFiles can determine the actual path.
                
                Before modifying an existing file:
                1. Find the actual file using listFiles or searchFiles.
                2. Read the file using readFile.
                3. Modify the existing file rather than creating a duplicate.
                
                MULTI-FILE TASK RULE:
                
                For tasks requiring multiple files:
                
                1. First inspect all relevant existing files.
                2. Determine which files need to be created and which need modification.
                3. Make the changes using the appropriate tools.
                4. Do not create unnecessary files.
                5. Keep the implementation consistent with the existing architecture.
                6. Verify the complete feature, not just individual files.
                
                IMPORTANT:
                When the user asks you to fix something, explaining how to fix it is NOT completing the task.
                You must actually modify the files using the available tools.
                
                                """
                .formatted(
                        agent.getName(),
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
