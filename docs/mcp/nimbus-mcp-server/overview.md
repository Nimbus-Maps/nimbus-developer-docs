---
sidebar_position: 1
title: Nimbus MCP Server
slug: /mcp/nimbus-mcp-server
description: Connect Claude, ChatGPT, Microsoft 365 Copilot, and other MCP clients to Nimbus property intelligence.
---

# Nimbus MCP Server

The Nimbus MCP server lets supported AI assistants search Nimbus property intelligence through the [Model Context Protocol](https://modelcontextprotocol.io/). Use it when you want Claude, ChatGPT, Microsoft 365 Copilot, or another MCP-compatible client to answer property questions or perform an analysis using live Nimbus data.

In order to use your MCP connector, you will be prompted to sign in using the same email address that you use to login to https://platform.nimbusmaps.co.uk. First contact Nimbus to enable MCP for your account and then sign in when prompted by your AI assistant.

Once you have it setup, you can try prompts ranging from a simple:

```text
Find the title for 103 Colmore Row, Birmingham and tell me who owns it.
```

to the more complex:

```text
Please create a full, professional commercial report on that property.
```

or try bringing it into whatever your usual workflow is: 

```text
Find comparable evidence to support the valuation of grade A office space in that building.
```
```text
Show me the planning history and any listed building or conservation area constraints.
```
```text
Find the brochures for any similar freeholds that are currently on the market.
```
```text
Estimate footfall and road traffic for that title.
```

## Server Details

| Setting | Value |
|---------|-------|
| MCP server URL | `https://mcp.nimbusmaps.co.uk/mcp` |
| Transport | Streamable HTTP |
| Authentication | OAuth 2.0 with Dynamic Client Registration (DCR) |

Your Nimbus account, subscription, and product permissions determine which tools and data are available after authentication.

## Before You Start

Make sure you have:

- Access to a Nimbus account that is enabled for the MCP server.
- Permission from your organization to connect external AI tools to your Nimbus data.
- A client that supports remote MCP servers over Streamable HTTP such as Claude, ChatGPT or Microsoft 365 Copilot.
- Access to `https://mcp.nimbusmaps.co.uk/mcp` from the AI platform you are using.

During setup, the AI client should open a Nimbus authorization page. Sign in, review the requested access, and approve the connection. You do not need to create a client ID or client secret for clients that support DCR.

## Integrate With Claude

Claude supports remote MCP custom connectors in Claude, Claude Desktop, Cowork, and Claude mobile. For Team and Enterprise plans, an Owner adds the connector for the organization first; individual users then connect their own Nimbus account.

### Team and Enterprise Plans

1. In Claude, an Owner opens **Organization settings > Connectors**.
2. Select **Add**.
3. Choose **Custom**, then **Web**.
4. Enter the remote MCP server URL:

   ```text
   https://mcp.nimbusmaps.co.uk/mcp
   ```

5. Leave advanced OAuth client ID and client secret fields blank unless Nimbus has told you to use a specific static client registration.
6. Select **Add**.
7. Each user opens **Customize > Connectors**, finds the Nimbus custom connector, and selects **Connect**.
8. Complete the Nimbus OAuth authorization flow.
9. In a chat, use the **+** menu, select **Connectors**, and enable the Nimbus connector for the conversation.

### Individual Plans

1. In Claude, open **Customize > Connectors**.
2. Select **+**, then **Add custom connector**.
3. Enter:

   ```text
   https://mcp.nimbusmaps.co.uk/mcp
   ```

4. Leave advanced OAuth client ID and client secret fields blank unless Nimbus has supplied them.
5. Select **Add**.
6. Select **Connect** and complete the Nimbus OAuth authorization flow.
7. Enable the connector from the **+** menu in any conversation where you want Claude to use Nimbus data.

For Claude's latest custom connector guidance, see [Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

## Integrate With ChatGPT

ChatGPT connects to remote MCP servers through custom apps. Availability and publishing controls depend on your ChatGPT plan and workspace settings. For workspace deployments, a ChatGPT Business, Enterprise, or Edu admin normally creates, tests, and publishes the custom MCP app before users enable it.

1. In ChatGPT, make sure developer mode for custom MCP apps is enabled for your workspace or account.
2. Open **Settings > Apps > Create**, or ask a workspace Admin or Owner to open **Workspace settings > Apps > Create**.
3. Create a new custom app and enter the Nimbus MCP endpoint:

   ```text
   https://mcp.nimbusmaps.co.uk/mcp
   ```

4. Select OAuth authentication when prompted.
5. Select **Scan Tools**.
6. Complete the Nimbus OAuth authorization prompt.
7. Wait for ChatGPT to finish scanning the available MCP tools.
8. Select **Create**.
9. Test the draft app in a new chat by selecting it from the tools menu or mentioning it in your prompt.
10. When testing is complete, an Admin or Owner can publish the app from **Workspace settings > Apps > Drafts**.

After the app is published, users can select it for a message from the ChatGPT tools menu or mention it when they want fresh Nimbus data.

For ChatGPT-specific setup and admin controls, see the OpenAI Docs pages for [Developer mode and MCP apps in ChatGPT](https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta) and [Apps in ChatGPT](https://help.openai.com/en/articles/11487775-connectors-in).

## Integrate With Microsoft 365 Copilot

Microsoft allows you to integrate with MCP servers by building a Copilot Studio agent.

1. Open the agent in Microsoft Copilot Studio.
2. Go to the agent's **Tools** page.
3. Select **Add a tool**.
4. Select **New tool**.
5. Select **Model Context Protocol**.
6. Enter a clear server name and description, for example:

   | Field | Suggested value |
   |-------|-----------------|
   | Server name | `Nimbus MCP Server` |
   | Server description | `Search Nimbus property titles, addresses, and comparable deal data.` |
   | Server URL | `https://mcp.nimbusmaps.co.uk/mcp` |

7. For authentication, select **OAuth 2.0**.
8. Select **Dynamic discovery**.
9. Select **Create**. Copilot Studio should discover the OAuth endpoints and register the client automatically.
10. Create a new connection for the Nimbus MCP server.
11. Select **Add to agent**.
12. Test the agent with a Nimbus-specific prompt before publishing it to users.

For Microsoft's Copilot Studio guidance, see [Connect your agent to an existing Model Context Protocol server](https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent).

## Security And Permissions

MCP clients can call tools on your behalf after you authorize them. Keep these practices in mind:

- Connect only from AI tools and workspaces that your organization trusts.
- Review the OAuth consent screen before authorizing access.

## Support

When contacting Nimbus support, include:

- The AI client and plan you are using.
- The user or tenant affected.
- The approximate time of the failed connection.
- The error message shown by the AI client.
- Whether OAuth authorization completed successfully.
