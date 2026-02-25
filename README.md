# Ragatool: Local RAG & MCP Servers Solution

## Project Overview

Ragatool is a locally deployable solution designed to empower users with their own knowledge base using Retrieval-Augmented Generation (RAG) and a Model Context Protocol (MCP) Server. This project allows you to vectorize various data sources – including books, specifications, documentation, code, and web pages – to create a personalized, local knowledge base. The core unit of organization is a "collection," which can be configured with different embedders and chunking settings to optimize retrieval.

All 3rd party integrations (OnlyOffice, Mozilla Thunderbird, Microsoft Outlook) connect to Ragatool through a single unified MCP server interface using WebSocket communication.

**Note:** This project is currently under active development, and many features are in pre-production.

## Key Features

- **Vectorization of diverse data sources:** Books, specifications, documentation, code, web pages.
- **Collection-based organization:** Manage your knowledge in logical, configurable units.
- **Support for different embedders:** Choose the best embedding model for your specific needs.
- **Configurable chunking settings:** Optimize how your documents are broken down for retrieval.
- **User-friendly interface:** Easily manage collections and imports.
- **API-driven backend:** Robust and extensible API for programmatic access.
- **Docker/Podman compatibility:** Simple local deployment and management.
- **Unified MCP Server:** Access from any AI agent through a single MCP endpoint.
- **3rd Party Integrations:** Seamless integration with popular desktop applications.

## Getting Started (Local Deployment)

To get started with Ragatool, you will need Docker or Podman installed on your system or you can run servers locally.

## Build and Run the Containers

1. **Navigate to the project root:**
   Open your terminal or command prompt and navigate to the root directory of the `Ragatool` project, where `docker-compose.yml` is located.
2. **Build the Docker images and run the containers:**
   This command will build the Docker images for both the backend and frontend services based on their respective `Dockerfile`s.

   `docker compose up -d --build`

- The FastAPI backend will be accessible externally on `http://localhost:4301`.
- The Angular frontend will be accessible externally on `http://localhost:4300`.
- The MCP Server on `http://localhost:4302/mcp`.

## Ragatool MCP Configuration

To configure Ragatool MCP, add the following to your configuration:

1. SSE:

```json
"Ragatool": {
      "url": "http://localhost:4302/mcp"
    }
```
2. HTTP:

```json
"Ragatool": {
      "url": "http://localhost:4303/mcp"
    }
```

## 3rd Party Integrations

Ragatool provides plugins for popular desktop applications, enabling AI agents to interact with your data across different platforms. All plugins communicate with the Ragatool server via WebSocket at `ws://localhost:8000/extensions/ws`.

### OnlyOffice Plugin

Located in `plugins/onlyoffice/`

The Ragatool OnlyOffice Plugin enables direct integration with the OnlyOffice text editor. This allows users to:
- Connect OnlyOffice with the Ragatool RAG system.
- Read and modify DOCX documents directly within the OnlyOffice editor, leveraging Ragatool's knowledge base.
- Provides AI agent access to documents through the unified MCP server interface.

### Mozilla Thunderbird Plugin

Located in `plugins/thunderbird/`

A WebExtension that connects Mozilla Thunderbird to the Ragatool server. Available commands:
- `account_list` - Get list of all configured email accounts
- `email_query` - Search messages by subject, author, date, read status, attachments, and more
- `get_full_message` - Retrieve full message details including headers and MIME parts

### Microsoft Outlook Plugin

Located in `plugins/outlook/`

A C# AddIn that integrates Microsoft Outlook with Ragatool. Provides similar functionality to the Thunderbird plugin, enabling AI agents to:
- Access email accounts
- Query and search emails
- Retrieve full message content

## Architecture

All plugins use a unified WebSocket-based command protocol:
```
Client (Plugin) <--WebSocket--> Ragatool Server <---> MCP <---> AI Agent
```

This architecture allows any AI agent to interact with multiple desktop applications through a single MCP server endpoint.

## Development Status

Ragatool is an evolving project. While the core functionalities are in place, many features are still under active development and should be considered pre-production. We welcome contributions and feedback from the community.

## License

This project is licensed under the MIT License.
