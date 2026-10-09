const BACKEND_URL = "http://localhost:8080";

/**
 * Checks if the Spring Boot backend is active and reachable
 */
export async function checkBackendStatus() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(BACKEND_URL + "/agent", {
      method: "GET",
      signal: controller.signal
    });
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
    const response = await fetch(
      BACKEND_URL + "/agent/ask?question=" + encodeURIComponent(question)
    );

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
    console.error("Agent Mesh backend request failed:", error);

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