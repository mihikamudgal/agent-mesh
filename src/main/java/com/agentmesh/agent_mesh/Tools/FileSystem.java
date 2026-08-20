package com.agentmesh.agent_mesh.Tools;

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

    public FileSystem(
            @Value("${agent.filesystem.workspace}") String workspace) {
        this.fileRoot = Path.of(workspace)
                .toAbsolutePath()
                .normalize();
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
            if (!Files.exists(path)) {
                return "File not found: " + filePath;
            }
            if (!Files.isRegularFile(path)) {
                return "The path is not a file: " + filePath;
            }
            return Files.readString(path);

        } catch (IOException e) {
            return "Error reading file: " + e.getMessage();
        }
    }

    @Tool(description = "Search source files in the workspace for a class, method, variable, or text")
    public String searchFiles(String searchItem) {
        try {
            return Files.walk(fileRoot)
                    .filter(Files:: isRegularFile)
                    .filter(path -> !path.toString().contains(".git"))
                    .filter(path -> !path.toString().contains("target"))
                    .filter(path -> {
                        try{
                            return Files.readString(path).contains(searchItem);
                        }catch (IOException e){
                            return false;
                        }
                    })
                    .map(path -> fileRoot.relativize(path).toString())
                    .collect(Collectors.joining("\n"));

        } catch (IOException e) {
            return "Error searching workspace: " + e.getMessage();
        }
    }
    private Path resolvePath(String filePath) {
        Path path = Path.of(filePath);
        if (!path.isAbsolute()) {
            path = fileRoot.resolve(filePath);
        }
        return path.toAbsolutePath().normalize();
    }
}
