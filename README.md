# AgentMesh

AgentMesh is a Spring Boot project exploring the idea of a collaborative agent ecosystem where multiple AI agents can work together to assist with app building, automation, and playful creative tasks. The current codebase lays the foundation for that vision by exposing simple agent, AI, and memory APIs that can be extended into a richer multi-agent platform.

## Project vision

The long-term goal is to create a mesh of specialized agents that can coordinate around tasks such as:

- building software features and prototypes
- reasoning through product ideas
- creating content and automation workflows
- managing memory and context between interactions
- enabling teams of agents to collaborate on creative or technical work

This repo currently serves as the starter foundation for that system.

## Tech stack

- Java 21
- Spring Boot 4.1.0
- Spring AI with Ollama integration
- Maven
- REST APIs

## Project structure

```text
agent-mesh/
├── src/
│   ├── main/
│   │   ├── java/com/agentmesh/agent_mesh/
│   │   │   ├── Controller/
│   │   │   │   ├── AgentController.java
│   │   │   │   ├── AiController.java
│   │   │   │   ├── HelloController.java
│   │   │   │   └── MemoryController.java
│   │   │   ├── Model/
│   │   │   │   ├── Agent.java
│   │   │   │   └── Memory.java
│   │   │   ├── Service/
│   │   │   │   ├── AgentService.java
│   │   │   │   ├── AiService.java
│   │   │   │   └── MemoryService.java
│   │   │   └── AgentMeshApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/java/com/agentmesh/agent_mesh/
│       └── AgentMeshApplicationTests.java
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md
```

## Current functionality

The project currently includes these core components:

### 1. Agent model
A simple `Agent` object with:

- id
- name
- role
- personality

This is the basic building block for a future multi-agent system.

### 2. AI integration
The app integrates with Ollama through Spring AI. The `AiService` sends user questions to the configured local model and returns the response.

### 3. Memory layer
The `MemoryService` keeps a simple in-memory list of entries, allowing the app to store short text memories that could later be used for agent context or interaction history.

### 4. REST endpoints
The project exposes basic endpoints for a lightweight agent mesh prototype.

## API endpoints

### Health

- `GET /hello`  
  Returns a simple greeting.

- `GET /status`  
  Returns a running-state message.

### Agent

- `GET /agent`  
  Returns a sample agent object.

### AI

- `GET /ask?question=...`  
  Sends a question to the configured AI model.

Example:

```bash
curl "http://localhost:8080/ask?question=Design%20a%20fun%20app%20idea%20for%20students"
```

### Memory

- `POST /memory?content=...`  
  Saves content into the in-memory list.

- `GET /memory`  
  Retrieves all stored memories.

Example:

```bash
curl -X POST "http://localhost:8080/memory?content=User%20wants%20a%20dashboard%20for%20agents"
curl "http://localhost:8080/memory"
```

## Configuration

The app configuration lives in `src/main/resources/application.properties`.

```properties
spring.application.name=agent-mesh

spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.options.model=qwen3:4b
spring.ai.ollama.chat.think=false
```

This configuration expects a local Ollama instance running on port `11434`.

## Prerequisites

Before running the project, make sure you have:

- Java 21 installed
- Maven installed or use Maven wrapper (`./mvnw`)
- Ollama installed and running locally
- An AI model pulled into Ollama (for example `qwen3:4b`)

## Run locally

1. Clone the repo
2. Start Ollama locally
3. Run the app:

```bash
./mvnw spring-boot:run
```

Or on Windows:

```bash
mvnw.cmd spring-boot:run
```

4. Open the app in your browser or test via curl:

```bash
http://localhost:8080/status
```

## Example workflow

A natural future flow for AgentMesh could look like this:

1. A user asks for an app idea or feature
2. One agent interprets the request
3. Another agent structures the implementation plan
4. A code-generation agent writes the app scaffolding
5. A memory agent stores important context and previous decisions
6. The system keeps working until the task is complete

This project is the early version of that workflow.

## Roadmap

Planned extensions for the project include:

- multiple specialized agents with different roles
- task orchestration between agents
- persistent memory storage instead of in-memory lists
- agent-to-agent communication
- app generation pipelines
- UI dashboard for agent coordination
- logging and traceability for agent actions
- support for more LLM providers and tools

## Notes

This repository is intentionally lightweight and experimental. It is a strong starting point for building a more advanced agent mesh where software agents collaborate on creative, technical, and real-world tasks.

## License

This project currently does not specify a license. If you plan to share or publish it publicly, add an appropriate open-source license such as MIT or Apache 2.0.
