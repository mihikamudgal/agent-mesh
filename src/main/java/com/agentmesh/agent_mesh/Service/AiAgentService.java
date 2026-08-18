package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

@Service
public class AiAgentService {
    private final ChatClient chatClient;
    private final MemoryService memoryService;
    private final AgentService agentService;
    public AiAgentService(ChatClient.Builder chatClientBuilder, MemoryService memoryService, AgentService agentService) {
        this.chatClient = chatClientBuilder.build();
        this.memoryService = memoryService;
        this.agentService = agentService;
    }
    public String ask( String question){
        Agent agent = agentService.createAgent();

        String memories = memoryService.getMemories(agent.getId())
                .stream()
                .map(memory -> memory.getContent())
                .reduce("", (a, b) -> a + "\n" + b);

        String prompt = """
                    You are an AI agent.
                           Your identity:
                           Name: %s
                           Role: %s
                           Personality: %s
                           Here are some things you remember about the user:
                           %s
                   
                           User question:
                           %s
                           Answer according to your identity and use the memories when relevant.
                           """.formatted(
                                   agent.getName(),
                                   agent.getRole(),
                                   agent.getPersonality(),
                                   memories,
                                   question
                           );

        return chatClient
                .prompt(prompt)
                .call()
                .content();
        }
}
