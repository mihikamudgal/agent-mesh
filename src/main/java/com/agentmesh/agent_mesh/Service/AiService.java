package com.agentmesh.agent_mesh.Service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {
    private final ChatClient chatClient;

    public AiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String ask(String question) {

        return chatClient
                .prompt()
                .user(question)
                .call()
                .content();
    }
}
