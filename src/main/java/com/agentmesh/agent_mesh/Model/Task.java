package com.agentmesh.agent_mesh.Model;

public class Task {
        private String fromAgent;
        private String toAgent;
        private String task;
        private String result;

        public Task(String fromAgent, String toAgent, String task) {
            this.fromAgent = fromAgent;
            this.toAgent = toAgent;
            this.task = task;
        }
        public String getFromAgent() {
            return fromAgent;
        }
        public String getToAgent() {
            return toAgent;
        }
        public String getTask() {
            return task;
        }
        public String getResult() {
            return result;
        }
        public void setResult(String result) {
            this.result = result;
        }
    }
