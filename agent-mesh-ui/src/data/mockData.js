export const AGENTS = [
  {
    id: "software-agent",
    name: "AgentCoder",
    role: "Software Developer",
    status: "online",
    badgeColor: "#10b981",
    accentColor: "#10b981",
    avatar: "💻",
    description: "Handles code creation, debugging, refactoring, and automated test execution with Maven.",
    systemPrompt: "Helpful, practical and concise",
    tools: ["FileSystem", "Execution", "AssignTask"]
  },
  {
    id: "designer-agent",
    name: "DesignerAgent",
    role: "Software Designer",
    status: "standby",
    badgeColor: "#a855f7",
    accentColor: "#a855f7",
    avatar: "📐",
    description: "Handles system architecture, database design, API modeling, and schema relationships.",
    systemPrompt: "Creative, structured and detail-oriented",
    tools: ["FileSystem"]
  },
  {
    id: "ops-agent",
    name: "OpsAgent",
    role: "DevOps Engineer",
    status: "standby",
    badgeColor: "#38bdf8",
    accentColor: "#38bdf8",
    avatar: "⚙️",
    description: "Handles Docker containerization, deployments, system scripts, and terminal monitoring.",
    systemPrompt: "Reliable, systematic and security-conscious",
    tools: ["Execution"]
  }
];

export const INITIAL_CHATS = [
  {
    id: "chat-login-api",
    title: "Login API",
    updatedAt: "10 mins ago",
    activeAgentId: "software-agent",
    messages: [
      {
        id: "msg-1",
        sender: "user",
        text: "Create a secure JWT Login API controller with token generation for Agent Mesh.",
        timestamp: "10:14 AM"
      },
      {
        id: "msg-2",
        sender: "ai",
        agentId: "software-agent",
        agentName: "AgentCoder",
        timestamp: "10:15 AM",
        text: "I have implemented the JWT authentication endpoint in `AuthController.java` and configured the token issuance service. Here is the implementation:\n\n```java\n@RestController\n@RequestMapping(\"/api/auth\")\n@CrossOrigin(origins = \"http://localhost:5173\")\npublic class AuthController {\n    private final AuthService authService;\n\n    @PostMapping(\"/login\")\n    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {\n        String token = authService.authenticate(req.getUsername(), req.getPassword());\n        return ResponseEntity.ok(new AuthResponse(token, \"Bearer\", 86400));\n    }\n}\n```\n\nI also verified this using the workspace tests.",
        toolActivities: [
          {
            id: "tool-1",
            agent: "AgentCoder",
            toolName: "FileSystem.readFile",
            args: { filePath: "src/main/resources/application.properties" },
            status: "success",
            duration: "18ms",
            output: "Read 477 bytes: spring.datasource.url=jdbc:postgresql://localhost:5432/agentmesh..."
          },
          {
            id: "tool-2",
            agent: "AgentCoder",
            toolName: "FileSystem.writeFile",
            args: { filePath: "src/main/java/com/agentmesh/agent_mesh/Controller/AuthController.java" },
            status: "success",
            duration: "42ms",
            output: "File written successfully: AuthController.java (38 lines)"
          },
          {
            id: "tool-3",
            agent: "AgentCoder",
            toolName: "Execution.runTests",
            args: { command: ".\\mvnw.cmd test" },
            status: "success",
            duration: "1.4s",
            output: "Tests run: 3, Failures: 0, Errors: 0, Skipped: 0. BUILD SUCCESS."
          }
        ]
      }
    ]
  },
  {
    id: "chat-fix-auth",
    title: "Fix authentication",
    updatedAt: "1 hour ago",
    activeAgentId: "software-agent",
    messages: [
      {
        id: "msg-1",
        sender: "user",
        text: "Fix authentication: CORS headers are rejecting requests from http://localhost:5173 when calling /agent/ask.",
        timestamp: "9:20 AM"
      },
      {
        id: "msg-2",
        sender: "ai",
        agentId: "software-agent",
        agentName: "AgentCoder",
        timestamp: "9:21 AM",
        text: "I inspected `AiAgentController.java` and noticed the `@CrossOrigin` annotation was either missing or restricted. I updated the controller to explicitly allow `http://localhost:5173` with all common HTTP methods.\n\nCheck the file diff below:",
        toolActivities: [
          {
            id: "tool-1",
            agent: "AgentCoder",
            toolName: "FileSystem.readFile",
            args: { filePath: "src/main/java/com/agentmesh/agent_mesh/Controller/AiAgentController.java" },
            status: "success",
            duration: "12ms",
            output: "Read AiAgentController.java (35 lines)"
          },
          {
            id: "tool-2",
            agent: "AgentCoder",
            toolName: "Execution.gitDiff",
            args: {},
            status: "success",
            duration: "85ms",
            output: "diff --git a/AiAgentController.java b/AiAgentController.java\n+ @CrossOrigin(origins = \"http://localhost:5173\")"
          }
        ]
      }
    ]
  },
  {
    id: "chat-postgres",
    title: "PostgreSQL setup",
    updatedAt: "Yesterday",
    activeAgentId: "designer-agent",
    messages: [
      {
        id: "msg-1",
        sender: "user",
        text: "Configure PostgreSQL connection and create the initial database schema for agent memories.",
        timestamp: "Yesterday, 3:15 PM"
      },
      {
        id: "msg-2",
        sender: "ai",
        agentId: "designer-agent",
        agentName: "DesignerAgent",
        timestamp: "Yesterday, 3:16 PM",
        text: "I've structured the database configuration and mapped the JPA Memory entity for long-term agent recall. Here is the configuration and schema design:\n\n```sql\nCREATE TABLE agent_memory (\n    id BIGSERIAL PRIMARY KEY,\n    agent_id VARCHAR(64) NOT NULL,\n    content TEXT NOT NULL,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\nCREATE INDEX idx_agent_id ON agent_memory(agent_id);\n```\n\nConfigured in `application.properties` under `spring.datasource.url=jdbc:postgresql://localhost:5432/agentmesh`.",
        toolActivities: [
          {
            id: "tool-1",
            agent: "DesignerAgent",
            toolName: "FileSystem.editFile",
            args: { filePath: "src/main/resources/application.properties" },
            status: "success",
            duration: "25ms",
            output: "Updated PostgreSQL database settings and connection pool parameters."
          }
        ]
      }
    ]
  },
  {
    id: "chat-dashboard",
    title: "Build dashboard",
    updatedAt: "2 days ago",
    activeAgentId: "ops-agent",
    messages: [
      {
        id: "msg-1",
        sender: "user",
        text: "Build dashboard metrics to monitor agent memory usage and task execution latency.",
        timestamp: "Oct 1, 4:00 PM"
      },
      {
        id: "msg-2",
        sender: "ai",
        agentId: "ops-agent",
        agentName: "OpsAgent",
        timestamp: "Oct 1, 4:01 PM",
        text: "I have prepared the monitoring telemetry endpoints and Docker health checks for the Agent Mesh services.\n\nMetrics exposed:\n- **Active Agent Threads**: 3\n- **Ollama qwen3:4b Latency**: ~320ms avg\n- **PostgreSQL Connection Pool**: 10 active / 2 idle\n- **Recent Tool Executions**: 48 calls in last hour",
        toolActivities: [
          {
            id: "tool-1",
            agent: "OpsAgent",
            toolName: "Execution.runCommand",
            args: { command: "docker stats --no-stream" },
            status: "success",
            duration: "310ms",
            output: "CONTAINER ID   NAME         CPU %     MEM USAGE / LIMIT\n8f9a2b1c4e     agentmesh-db 0.45%     84MiB / 16GiB\n3c4d5e6f7a     ollama-srv   12.1%     3.2GiB / 16GiB"
          }
        ]
      }
    ]
  }
];

export const WORKSPACE_FILES = [
  {
    id: "file-ai-controller",
    name: "AiAgentController.java",
    path: "src/main/java/com/agentmesh/agent_mesh/Controller/AiAgentController.java",
    type: "java",
    size: "1.1 KB",
    content: `package com.agentmesh.agent_mesh.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import com.agentmesh.agent_mesh.Service.AgentIntercomm;
import com.agentmesh.agent_mesh.Service.AiAgentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/agent")
@CrossOrigin(origins = "http://localhost:5173")
public class AiAgentController {

    private final AiAgentService aiService;
    private final AgentIntercomm agentIntercomm;

    public AiAgentController(AiAgentService aiService, AgentIntercomm agentIntercomm) {
        this.aiService = aiService;
        this.agentIntercomm = agentIntercomm;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return aiService.ask(question);
    }

    @PostMapping("/assign")
    public String assign(
            @RequestParam String toAgent,
            @RequestParam String task) {

        return agentIntercomm.assignTask(
                toAgent,
                task
        );
    }
}`
  },
  {
    id: "file-agent-manager",
    name: "AgentManager.java",
    path: "src/main/java/com/agentmesh/agent_mesh/Service/AgentManager.java",
    type: "java",
    size: "1.5 KB",
    content: `package com.agentmesh.agent_mesh.Service;

import com.agentmesh.agent_mesh.Model.Agent;
import org.springframework.stereotype.Service;

@Service
public class AgentManager {
    private final AgentMap agentMap;

    public AgentManager(AgentMap agentMap) {
        this.agentMap = agentMap;
    }

    public Agent route(String agentId) {
        Agent agent = agentMap.getAgent(agentId);
        if (agent == null) {
            throw new IllegalArgumentException("Agent was not found: " + agentId);
        }
        return agent;
    }

    public Agent routeByTask(String question) {
        String task = question.toLowerCase();
        
        // Software Designer routing
        if ((task.contains("design") || task.contains("architecture") || task.contains("schema"))
                && !task.contains("build")
                && !task.contains("implement")
                && !task.contains("develop")
                && !task.contains("create")) {
            return agentMap.getAgent("designer-agent");
        }

        // DevOps & Infrastructure routing
        if ((task.contains("deploy")
                || task.contains("deployment")
                || task.contains("docker")
                || task.contains("server")
                || task.contains("devops"))
                && !task.contains("build")
                && !task.contains("implement")
                && !task.contains("develop")
                && !task.contains("create")) {
            return agentMap.getAgent("ops-agent");
        }

        // Default: Software Developer (AgentCoder)
        return agentMap.getAgent("software-agent");
    }
}`
  },
  {
    id: "file-filesystem",
    name: "FileSystem.java",
    path: "src/main/java/com/agentmesh/agent_mesh/Tools/FileSystem.java",
    type: "java",
    size: "6.8 KB",
    content: `package com.agentmesh.agent_mesh.Tools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Collectors;

@Component
public class FileSystem {
    private final Path fileRoot;

    public FileSystem(@Value("\${agent.filesystem.workspace}") String workspace) {
        this.fileRoot = Path.of(workspace).toAbsolutePath().normalize();
    }

    @Tool(description = "List files and folders inside the current workspace")
    public String listFiles() {
        try {
            return Files.walk(fileRoot, 3)
                    .filter(path -> !path.equals(fileRoot))
                    .filter(path -> !path.toString().contains(".git"))
                    .filter(path -> !path.toString().contains("target"))
                    .filter(path -> !path.toString().contains(".idea"))
                    .map(path -> fileRoot.relativize(path).toString())
                    .collect(Collectors.joining("\n"));
        } catch (IOException e) {
            return "Error listing files: " + e.getMessage();
        }
    }

    @Tool(description = "Read the contents of a file inside the workspace")
    public String readFile(String filePath) {
        try {
            Path path = resolvePath(filePath);
            if (!Files.exists(path)) return "File not found: " + filePath;
            return Files.readString(path);
        } catch (IOException e) {
            return "Error reading file: " + e.getMessage();
        }
    }

    @Tool(description = "Create or replace a file")
    public String writeFile(String filePath, String content) {
        try {
            Path path = resolvePath(filePath);
            if (path.getParent() != null) Files.createDirectories(path.getParent());
            Files.writeString(path, content);
            return "File written: " + filePath;
        } catch (IOException e) {
            return "Error writing file: " + e.getMessage();
        }
    }

    private Path resolvePath(String filePath) {
        Path path = Path.of(filePath);
        if (!path.isAbsolute()) path = fileRoot.resolve(filePath);
        return path.toAbsolutePath().normalize();
    }
}`
  },
  {
    id: "file-execution",
    name: "Execution.java",
    path: "src/main/java/com/agentmesh/agent_mesh/Tools/Execution.java",
    type: "java",
    size: "2.2 KB",
    content: `package com.agentmesh.agent_mesh.Tools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.*;
import java.nio.file.Path;

@Component
public class Execution {
    private final Path fileRoot;

    public Execution(@Value("\${agent.filesystem.workspace}") String workspace) {
        this.fileRoot = Path.of(workspace).toAbsolutePath().normalize();
    }

    @Tool(description = "Run terminal command and return its output")
    public String runCommand(String command) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "powershell.exe", "-NoProfile", "-Command", command
            );
            processBuilder.directory(fileRoot.toFile());
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            int exitCode = process.waitFor();
            output.append("\nExit code: ").append(exitCode);
            return output.toString();
        } catch (Exception e) {
            return "Error running command: " + e.getMessage();
        }
    }

    @Tool(description = "Run the project's tests using the Maven Wrapper")
    public String runTests() {
        return runCommand(".\\mvnw.cmd test");
    }

    @Tool(description = "Show the changes made to the project using git diff")
    public String gitDiff() {
        return runCommand("git diff");
    }
}`
  },
  {
    id: "file-app-props",
    name: "application.properties",
    path: "src/main/resources/application.properties",
    type: "properties",
    size: "477 B",
    content: `spring.application.name=agent-mesh

spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.model=qwen3:4b
spring.ai.ollama.chat.think=false

spring.datasource.url=jdbc:postgresql://localhost:5432/agentmesh
spring.datasource.username=postgres
spring.datasource.password=password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
agent.filesystem.workspace=C:/Users/KIIT/Downloads/agent-mesh/agent-mesh`
  },
  {
    id: "file-pom",
    name: "pom.xml",
    path: "pom.xml",
    type: "xml",
    size: "2.0 KB",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.2</version>
        <relativePath/>
    </parent>
    <groupId>com.agentmesh</groupId>
    <artifactId>agent-mesh</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>agent-mesh</name>
    <description>Autonomous Multi-Agent Mesh with Spring AI</description>
    <properties>
        <java.version>21</java.version>
        <spring-ai.version>1.0.0-M1</spring-ai.version>
    </properties>
</project>`
  }
];

export const MOCK_DIFFS = [
  {
    id: "diff-cors-auth",
    filePath: "src/main/java/com/agentmesh/agent_mesh/Controller/AiAgentController.java",
    description: "Enable frontend CORS origin for Vite dev server",
    author: "AgentCoder",
    stats: { additions: 3, deletions: 1 },
    lines: [
      { type: "normal", lineOld: 6, lineNew: 6, text: "import com.agentmesh.agent_mesh.Service.AiAgentService;" },
      { type: "normal", lineOld: 7, lineNew: 7, text: "import org.springframework.web.bind.annotation.*;" },
      { type: "normal", lineOld: 8, lineNew: 8, text: "" },
      { type: "normal", lineOld: 9, lineNew: 9, text: "@RestController" },
      { type: "normal", lineOld: 10, lineNew: 10, text: "@RequestMapping(\"/agent\")" },
      { type: "del", lineOld: 11, lineNew: null, text: "- @CrossOrigin" },
      { type: "add", lineOld: null, lineNew: 11, text: "+ @CrossOrigin(origins = \"http://localhost:5173\")" },
      { type: "add", lineOld: null, lineNew: 12, text: "+ // Auto-routed by Agent Mesh Multi-Agent Core" },
      { type: "normal", lineOld: 12, lineNew: 13, text: "public class AiAgentController {" },
      { type: "normal", lineOld: 13, lineNew: 14, text: "    private final AiAgentService aiService;" },
      { type: "normal", lineOld: 14, lineNew: 15, text: "    private final AgentIntercomm agentIntercomm;" }
    ]
  },
  {
    id: "diff-postgres",
    filePath: "src/main/resources/application.properties",
    description: "Add HikariCP Connection Pooling for PostgreSQL",
    author: "DesignerAgent",
    stats: { additions: 5, deletions: 0 },
    lines: [
      { type: "normal", lineOld: 7, lineNew: 7, text: "spring.datasource.password=password" },
      { type: "normal", lineOld: 8, lineNew: 8, text: "" },
      { type: "add", lineOld: null, lineNew: 9, text: "+ spring.datasource.hikari.maximum-pool-size=15" },
      { type: "add", lineOld: null, lineNew: 10, text: "+ spring.datasource.hikari.minimum-idle=5" },
      { type: "add", lineOld: null, lineNew: 11, text: "+ spring.datasource.hikari.idle-timeout=30000" },
      { type: "add", lineOld: null, lineNew: 12, text: "+ spring.datasource.hikari.connection-timeout=20000" },
      { type: "normal", lineOld: 9, lineNew: 13, text: "spring.jpa.hibernate.ddl-auto=update" }
    ]
  }
];