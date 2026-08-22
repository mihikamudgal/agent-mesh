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

    @Tool(description = "Create a directory")
    public String createDirectory(String directoryPath) {
        try{
            Path path = resolvePath(directoryPath);
            Files.createDirectory(path);
            return "Directory created " + directoryPath;
        }
        catch (SecurityException e){
            return e.getMessage();
        }
        catch (IOException e) {
            return "Error creating directory: " + e.getMessage();
        }
    }

    @Tool(description = "Create or replace a file")
    public String writeFile(String filePath, String content){
        try{
            Path path = resolvePath(filePath);
            if(path.getParent() != null){
                Files.createDirectories(path.getParent());
            }
            Files.writeString(path , content);
            return "File written :" + filePath;
        }
        catch (SecurityException e){
            return e.getMessage();
        }
        catch (IOException e) {
            return "Error writing file: " + e.getMessage();
        }
    }

    @Tool(description = "Edit specific test in the existing file")
    public String editFile( String filePath, String oldText , String newText){
        try{
            Path path = resolvePath(filePath);
            if (!Files.exists(path)) {
                return "File not found: " + filePath;
            }
            if (!Files.isRegularFile(path)) {
                return "The path is not a file: " + filePath;
            }
            String content= Files.readString(path);
            if(!content.contains(oldText)){
                return "The specified text was not found :" + filePath;
            }
            String updatedContent = content.replace(oldText, newText);
            Files.writeString(path , updatedContent);
            return "File editing successfully: " + filePath;
        }
        catch(SecurityException e){
            return e.getMessage();
        }
        catch (IOException e) {
            return "Error editing file: " + e.getMessage();
        }
    }
    @Tool(description = "Delete file inside a workspace")
    public String deleteFile(String filePath){
        try{
            Path path = resolvePath(filePath);
            if(!Files.exists(path)){
                return "File not found :" + filePath;
            }
            if(!Files.isRegularFile(path)){
                return "The path is not a file: " + filePath;
            }
            Files.delete(path);
            return "File deleted successfully: " + filePath;
        }
        catch (SecurityException e){
            return e.getMessage();
        }
        catch (IOException e) {
            return "Error deleting file: " + e.getMessage();
        }
    }

    @Tool(description = "Delete directory inside the workspace")
    public String deleteDirectory(String filePath){
        try{
            Path path = resolvePath(filePath);
            if(!Files.exists(path)){
                return "File not found: " + filePath;
            }
            if(!Files.isDirectory(path)){
                return "The path is not a directory: " + filePath;
            }
            Files.delete(path);
            return "Directory deleted successfully: " + filePath;
        }
        catch (SecurityException e){
            return e.getMessage();
        }
        catch (IOException e) {
            return "Error deleting directory: " + e.getMessage();
        }
    }

    private Path resolvePath(String filePath) {
        Path path = Path.of(filePath);
        if (!path.isAbsolute()) {
            path = fileRoot.resolve(filePath);
        }
        path = path.toAbsolutePath().normalize();
        if(!path.startsWith(fileRoot)) {
            throw new SecurityException(
                    "Access denied: path is outside the workspace path:"
            );
        }
        return path;
    }
}
