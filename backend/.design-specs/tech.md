# Technology Stack

## Project Type
This project is a high-performance RAG (Retrieval-Augmented Generation) backend API service designed to manage document collections, process them into vectorized chunks, and provide a search interface for AI agents.

## Core Technologies

### Primary Language(s)
- **Language**: Python 3.12.3
- **Runtime/Compiler**: CPython
- **Language-specific tools**: pip (package management), venv (environment isolation).

### Key Dependencies/Libraries
- **FastAPI (0.121.0)**: Modern, high-performance web framework for building APIs.
- **FastMCP (2.13.1)**: Mission Control Protocol server implementation for agent-tool interaction.
- **FastEmbed (0.7.3)**: Efficient text embeddings generation.
- **ChromaDB (1.3.4)**: Open-source embedding database for vector storage.
- **SQLAlchemy (2.0.44)**: SQL toolkit and ORM for metadata storage in SQLite.
- **Pydantic (2.12.4)**: Data validation and settings management.
- **Uvicorn (0.38.0)**: ASGI server for running the FastAPI application.
- **LangChain Text Splitters (1.0.0)**: For intelligent document chunking.

### Application Architecture
The application follows a layered client-server architecture:
- **Routers**: FastAPI endpoints for HTTP/REST interaction.
- **CRUD**: Data access layer for both SQL (SQLite) and NoSQL (ChromaDB).
- **Internal Managers**: Singleton-based core logic (MCP, Embedding, Task Dispatcher).
- **Models/Schemas**: Business logic and data validation contracts.

### Data Storage
- **Primary storage**: SQLite (`ragatouille.db`) for collection metadata and task logs.
- **Vector storage**: ChromaDB (persistent in `./chroma_data`) for text embeddings.
- **Data formats**: JSON (API communication), NumPy/List[float] (embeddings).

### External Integrations
- **Protocols**: HTTP/REST for standard API, SSE (Server-Sent Events) and HTTP for MCP tools.
- **Real-time Communication**: Message Hub for task updates via SSE.

## Development Environment

### Build & Development Tools
- **Build System**: pip/setuptools.
- **Development workflow**: Local execution via `python app/main.py` or Uvicorn.

### Code Quality Tools
- **Testing Framework**: `pytest (9.0.0)` for unit and integration tests.
- **Static Analysis**: Standard Python type hints.

### Version Control & Collaboration
- **VCS**: Git.

## Deployment & Distribution
- **Target Platform(s)**: Linux/Windows/Docker-ready environments.
- **Distribution Method**: Docker image.
- **Installation Requirements**: Docker, Python 3.12+.

## Technical Decisions & Rationale
1. **Singleton Pattern for Managers**: Core services like `MCPManager` and `TextEmbedding` are implemented as singletons to ensure efficient resource usage and consistent state across the application.
2. **Dual-Transport MCP**: The server supports both SSE (for standard agents) and HTTP (for OpenCode-style tools) to maximize compatibility.
3. **Summary-based LTM**: Long Term Memory (issue #72) uses a "summary-to-fact" mapping to improve vector search relevance by embedding concise summaries while returning full factual text.

## Known Limitations
- **Scaling**: Currently optimized for single-instance deployments using SQLite.
- **Async Chroma**: ChromaDB operations are currently synchronous in most CRUD modules, which may block the event loop under heavy load.
