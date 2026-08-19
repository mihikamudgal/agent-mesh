package com.agentmesh.agent_mesh.Tools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Collectors;

@Component
public class ProjectInspection {
    private final Path projectPath = Path.of(".");

    @Tool(description = "List files and folder in the project")
    public String listFiles(){
        try{
            return Files.walk(projectPath, 2)
                    .filter(path -> !path.equals(projectPath))
                    .map(path -> projectPath.relativize(path).toString())
                    .collect(Collectors.joining("\n"));
        }
        catch (IOException e){
            return "Error listing files" + e.getMessage();
        }
    }

    @Tool(description = "Read contents of files")
    public String readFiles(String filePath){
        try{
            Path path = projectPath.resolve(filePath).normalize();
            if(!path.startsWith(projectPath.toAbsolutePath().normalize())){
                return "Access denied: File is outside the project";
            }
            if(!Files.exists(path)){
                return "File not found:" + filePath;
            }
            if(!Files.isRegularFile(path)){
                return "The path is not a regular file:" + filePath;
            }
            return Files.readString(path);
        } catch (IOException e) {
            return "Error reading files" + e.getMessage();
        }
    }

    @Tool(description = "Search files for a text, method name, class name or variable")
    public String searchFiles(String searchItem){
        try{
            return Files.walk(projectPath)
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
                    .map(path -> projectPath.relativize(path).toString())
                    .collect(Collectors.joining("\n"));

        }
        catch (IOException e){
            return "Error searching files" + e.getMessage();
        }
    }

}
