import { AmazonConnectApp } from "@amazon-connect/app";
import { AgentClient } from "@amazon-connect/contact";

const { provider } = AmazonConnectApp.init({
  onCreate: async (event) => {
    const { appInstanceId } = event.context;
    console.log("App initialized: ", appInstanceId);

    const agentClient = new AgentClient();
    const arn = await agentClient.getARN();
    const name = await agentClient.getName();
    const state = await agentClient.getState();
    console.log(`Got the arn value: ${arn}`);
    console.log(`Got the name value: ${name}`);
    console.log(`Got the state value: ${state}`);

    document.getElementById("arn").textContent = arn;
    document.getElementById("name").textContent = name;
    document.getElementById("status").textContent = state.name;

    const handler = async (data) => {
      console.log("Agent state change occurred! " + data);
      document.getElementById("status").textContent = data.state;
    };

    agentClient.onStateChanged(handler);
  },
  onDestroy: (event) => {
    console.log("App being destroyed");
  },
});
