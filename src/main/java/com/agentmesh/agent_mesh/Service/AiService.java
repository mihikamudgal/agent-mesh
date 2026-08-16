package com.agentmesh.agent_mesh.Service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {
    private final ChatClient chatClient;
    public AiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }
    public String askAgent( String question){
        String systemPrompt = """
    
                    Your role:
                    - Help users with programming and software development.
                    - You specialize in Java, Spring Boot, and backend development.
                    - Explain difficult concepts in simple words.
                    - Give practical and accurate answers.
                    - Be friendly and concise.
    
                    Your identity:
                    Name: AgentCoder
                    Role: Software Development Agent
                    """;

        return chatClient
                .prompt()
                .system(systemPrompt)
                .user(question)
                .call()
                .content();
    
    }
}
