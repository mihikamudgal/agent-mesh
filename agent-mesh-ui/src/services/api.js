const BACKEND_URL = "http://localhost:8080";


const AUTH_URL = "http://localhost:8080/api/auth";


function getAuthToken() {
  return (
    localStorage.getItem('agentMeshToken') ||
    sessionStorage.getItem('agentMeshToken')
  );
}

async function apiFetch(url, options = {}) {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 401) {
    throw new Error('Your session has expired. Please log in again.');
  }

  return response;
}

export async function signupUser(email, password) {
  return authRequest("/signup", email, password);
}

export async function loginUser(email, password) {
  return authRequest("/login", email, password);
}

async function authRequest(endpoint, email, password) {
  const response = await fetch(`${AUTH_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || "Authentication failed."
    );
  }

  return data;
}

/**
 * Checks if the Spring Boot backend is active and reachable
 */
export async function checkBackendStatus() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const response = await apiFetch(BACKEND_URL + "/agent", {
                             method: "GET",
                             signal: controller.signal
                           })
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { connected: true, data };
    }
    return { connected: false, error: "Status " + response.status };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

/**
 * Sends a question to the Agent Mesh backend, or falls back to intelligent local mesh simulation
 */
export async function askAgent(question, preferredAgentId = "software-agent") {
  try {
    const params = new URLSearchParams({
      question,
      agentId: preferredAgentId || "auto"
    });

    const response = await apiFetch(
                             `${BACKEND_URL}/agent/ask?${params.toString()}`
                           )

    if (!response.ok) {
      throw new Error("Server returned status " + response.status);
    }
    const rawText = await response.text();
    const cleaned = cleanResponse(rawText);
    return {
      success: true,
      source: "backend",
      agentId: preferredAgentId,
      text: cleaned
    };

  } catch (error) {
    console.error("Request failed:", error);

    return {
      success: false,
      source: "backend",
      agentId: preferredAgentId,
      text: "",
      error: error.message
    };
  }
}

function cleanResponse(text) {
  if (!text) return "";
  if (text.includes("</think>")) {
    return text.split("</think>").pop().trim();
  }
  if (text.includes("<think>")) {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  }
  return text.trim();
}


  export async function getChats() {
    const response = await apiFetch(`${BACKEND_URL}/api/chats`);
    if (!response.ok) throw new Error("Failed to load conversations");
    return response.json();
  }

  export async function createChat(title, agentId) {
    const response = await apiFetch(`${BACKEND_URL}/api/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, agentId })
    });

    if (!response.ok) throw new Error("Failed to create conversation");
    return response.json();
  }

  export async function getChat(chatId) {
    const response = await apiFetch(
      `${BACKEND_URL}/api/chats/${chatId}`
    );
    if (!response.ok) throw new Error("Failed to load conversation");
    return response.json();
  }

  export async function saveChatMessage(chatId, message) {
    const response = await apiFetch(
      `${BACKEND_URL}/api/chats/${chatId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: message.sender,
          agentId: message.agentId || null,
          agentName: message.agentName || null,
          agentRole: message.agentRole || null,
          agentColor: message.agentColor || null,
          content: message.text
        })
      }
    );

    if (!response.ok) throw new Error("Failed to save message");
    return response.json();
  }

  export async function deleteChatFromBackend(chatId) {
    const response = await apiFetch(
      `${BACKEND_URL}/api/chats/${chatId}`,
      { method: "DELETE" }
    );

    if (!response.ok) throw new Error("Failed to delete conversation");
  }
function simulateAgentResponse(question, forcedAgentId) {
  const q = question.toLowerCase();

  let agentId = forcedAgentId;
  if (!forcedAgentId || forcedAgentId === "auto") {
    if ((q.includes("design") || q.includes("architecture") || q.includes("schema") || q.includes("model")) &&
        !q.includes("build") && !q.includes("implement")) {
      agentId = "designer-agent";
    } else if (q.includes("deploy") || q.includes("docker") || q.includes("server") || q.includes("devops") || q.includes("cloud")) {
      agentId = "ops-agent";
    } else {
      agentId = "software-agent";
    }
  }


  if (agentId === "designer-agent") {
    return {
      success: true,
      source: "simulation",
      agentId: "designer-agent",
      agentName: "DesignerAgent",
      text: [
        "### 📐 Architectural Specification & Design",
        "",
        "I analyzed your request: **\"" + question + "\"** and designed the database schema model:",
        "",
        "```sql",
        "-- Schema Design for Agent Mesh Entities",
        "CREATE TABLE mesh_agent_task (",
        "    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),",
        "    session_id VARCHAR(64) NOT NULL,",
        "    target_agent VARCHAR(32) NOT NULL,",
        "    status VARCHAR(24) DEFAULT 'PENDING',",
        "    payload JSONB NOT NULL,",
        "    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
        ");",
        "",
        "CREATE INDEX idx_task_agent ON mesh_agent_task(target_agent, status);",
        "```",
        "",
        "**Key Architecture Highlights:**",
        "1. **Decoupled Messaging**: Task delegation mediated by `AgentIntercomm`.",
        "2. **State Persistence**: Memory entries preserved in PostgreSQL `agentmesh` database.",
        "3. **Security Boundary**: Path confinement inside `agent.filesystem.workspace`."
      ].join("\n"),
      toolActivities: [
        {
          id: "tool-sim-1",
          agent: "DesignerAgent",
          toolName: "FileSystem.listFiles",
          args: { directory: "src/main/java/com/agentmesh/agent_mesh/Model" },
          status: "success",
          duration: "14ms",
          output: "Agent.java\nMemory.java\nTask.java"
        },
        {
          id: "tool-sim-2",
          agent: "DesignerAgent",
          toolName: "FileSystem.readFile",
          args: { filePath: "src/main/resources/application.properties" },
          status: "success",
          duration: "18ms",
          output: "spring.datasource.url=jdbc:postgresql://localhost:5432/agentmesh..."
        }
      ]
    };
  }

  if (agentId === "ops-agent") {
    return {
      success: true,
      source: "simulation",
      agentId: "ops-agent",
      agentName: "OpsAgent",
      text: [
        "### ⚙️ DevOps & Infrastructure Plan",
        "",
        "Execution analysis for **\"" + question + "\"**:",
        "",
        "```dockerfile",
        "# Optimized multi-stage Dockerfile for agent-mesh",
        "FROM eclipse-temurin:21-jdk-alpine AS builder",
        "WORKDIR /workspace",
        "COPY . .",
        "RUN ./mvnw clean package -DskipTests",
        "",
        "FROM eclipse-temurin:21-jre-alpine",
        "VOLUME /tmp",
        "COPY --from=builder /workspace/target/*.jar app.jar",
        "EXPOSE 8080",
        "ENTRYPOINT [\"java\", \"-jar\", \"/app.jar\"]",
        "```",
        "",
        "**Environment Health Check:**",
        "- Container Engine: Docker Desktop (Running)",
        "- Ollama Server: `http://localhost:11434` (Listening with qwen3:4b)",
        "- Port Bindings: 8080 (Spring Boot), 5173 (Vite UI)"
      ].join("\n"),
      toolActivities: [
        {
          id: "tool-sim-1",
          agent: "OpsAgent",
          toolName: "Execution.runCommand",
          args: { command: "docker ps --filter name=agentmesh" },
          status: "success",
          duration: "140ms",
          output: "CONTAINER ID   IMAGE                 PORTS                    NAMES\n4a81bc7e21     agentmesh-db:latest   0.0.0.0:5432->5432/tcp   agentmesh-db"
        },
        {
          id: "tool-sim-2",
          agent: "OpsAgent",
          toolName: "Execution.gitDiff",
          args: {},
          status: "success",
          duration: "45ms",
          output: "git diff checked: Clean working tree on branch main."
        }
      ]
    };
  }

  // Default: software-agent (AgentCoder)
  return {
    success: true,
    source: "simulation",
    agentId: "software-agent",
    agentName: "AgentCoder",
    text: [
      "### 💻 Implementation by AgentCoder",
      "",
      "I evaluated your task: **\"" + question + "\"** and implemented the required logic:",
      "",
      "```java",
      "package com.agentmesh.agent_mesh.Service;",
      "",
      "import org.springframework.stereotype.Service;",
      "import java.util.concurrent.CompletableFuture;",
      "",
      "@Service",
      "public class MeshTaskExecutor {",
      "",
      "    public CompletableFuture<String> processAsync(String taskInput) {",
      "        return CompletableFuture.supplyAsync(() -> {",
      "            // Autonomous execution via Agent Mesh",
      "            return \"Task successfully executed for: \" + taskInput;",
      "        });",
      "    }",
      "}",
      "```",
      "",
      "I validated this against the project using `Execution.runTests` with Maven Wrapper and all checks passed!"
    ].join("\n"),
    toolActivities: [
      {
        id: "tool-sim-1",
        agent: "AgentCoder",
        toolName: "FileSystem.readFile",
        args: { filePath: "src/main/java/com/agentmesh/agent_mesh/Service/AiAgentService.java" },
        status: "success",
        duration: "21ms",
        output: "Read AiAgentService.java (42 lines)"
      },
      {
        id: "tool-sim-2",
        agent: "AgentCoder",
        toolName: "FileSystem.writeFile",
        args: { filePath: "src/main/java/com/agentmesh/agent_mesh/Service/MeshTaskExecutor.java" },
        status: "success",
        duration: "35ms",
        output: "File written successfully (18 lines)"
      },
      {
        id: "tool-sim-3",
        agent: "AgentCoder",
        toolName: "Execution.runTests",
        args: { command: ".\\mvnw.cmd test" },
        status: "success",
        duration: "1.2s",
        output: "Tests run: 4, Failures: 0, Errors: 0, Skipped: 0. BUILD SUCCESS"
      }
    ]
  };
}