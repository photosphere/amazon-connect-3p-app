import { AmazonConnectApp } from "@amazon-connect/app";
import { AgentClient, ContactClient } from "@amazon-connect/contact";
import { AppContactScope } from "@amazon-connect/app";

// Helper function to update UI elements
const updateUI = (id, value) => {
  document.getElementById(id).textContent = value;
};

// Initialize agent data and state change listener
const initializeAgent = async () => {
  const agentClient = new AgentClient();

  // Fetch agent data in parallel
  const [arn, name, state] = await Promise.all([
    agentClient.getARN(),
    agentClient.getName(),
    agentClient.getState(),
  ]);

  // Display initial agent data
  updateUI("arn", arn);
  updateUI("name", name);
  updateUI("status", state.name);

  // Listen for agent state changes
  agentClient.onStateChanged((data) => {
    updateUI("status", data.state);
  });
};

// Initialize contact connection listener
const initializeContact = async () => {
  const contactClient = new ContactClient();

  updateUI("contactId", AppContactScope.CurrentContactId);

  // Listen for contact connected events
  contactClient.onConnected(async (data) => {
    const { contactId } = data;

    // Fetch contact data in parallel
    const [channelType, queue, attributes] = await Promise.all([
      contactClient.getChannelType(contactId),
      contactClient.getQueue(contactId),
      contactClient.getAttributes(contactId, "*"),
    ]);

    // Display contact data
    updateUI("contactId", contactId);
    updateUI("queue", queue.name);
    updateUI("channelType", `${channelType.type} (${channelType.subtype})`);
    updateUI("attributes", JSON.stringify(attributes, null, 2));
  });
};

// Initialize Amazon Connect App
AmazonConnectApp.init({
  onCreate: async (event) => {
    console.log("App initialized:", event.context.appInstanceId);
    await initializeAgent();
    await initializeContact();
  },
  onDestroy: () => {
    console.log("App being destroyed");
  },
});
