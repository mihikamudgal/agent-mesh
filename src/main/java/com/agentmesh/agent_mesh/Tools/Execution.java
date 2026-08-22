package com.agentmesh.agent_mesh.Tools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class Execution {
    private final Path fileRoot;

    public Execution(@Value("${agent.filesystem.workspace}") String workspace) {
        this.fileRoot = Path.of(workspace)
                .toAbsolutePath()
                .normalize();
    }

    @Tool(description = "Run terminal command and return its output")
    public String runCommand(String command){
        try{
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "powershell.exe",
                    "-NoProfile",
                    "-Command",
                    command
            );
            processBuilder.directory(fileRoot.toFile());
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );
            StringBuilder output = new StringBuilder();
            String line;
            while((line = reader.readLine()) != null){
                output.append(line).append("\n");
            }
            int exitCode = process.waitFor();
            output.append("\nExit code:").append(exitCode);
            return output.toString();
        }
        catch(InterruptedException e){
            return "Error running command: " + e.getMessage();
        } catch (IOException e) {
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
}
