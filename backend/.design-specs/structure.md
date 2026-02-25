# Project Structure

## Directory Organization

```
app/
├── crud/                   # Create, Read, Update, Delete (CRUD) operations for database models.
│   ├── crud_collection.py  # SQLite/ChromaDB collection management.
│   └── crud_task.py        # SQLite task management.
├── internal/               # Core internal logic and singleton managers.
│   ├── mcp_manager.py      # MCP (Mission Control Protocol) implementation.
│   ├── embedding_manager.py# Text embedding singleton.
│   ├── tools.py            # Tool registration and core logic.
│   └── background_task_dispatcher.py # Task queue management.
├── models/                 # Business logic and complex data structures.
├── routers/                # FastAPI routers defining API endpoints.
├── schemas/                # Pydantic schemas for data validation.
├── __init__.py             # Initializes the 'app' package.
├── database.py             # SQLite connection and schema creation.
├── dependencies.py         # FastAPI dependency injection (DB, Task Dispatcher).
└── main.py                 # Application entry point and server setup.
tests/                      # Comprehensive test suite.
├── test_tools.py           # MCP tool verification.
└── test_collections_api.py # REST API verification.
```

## Naming Conventions

### Files
- **Modules**: `snake_case.py` (e.g., `crud_collection.py`, `background_task_dispatcher.py`).

### Code
- **Classes**: `PascalCase` (e.g., `MCPManager`, `CollectionCreate`).
- **Functions/Methods**: `snake_case` (e.g., `get_collections`, `add_fact`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DATABASE_URL`).
- **Variables**: `snake_case` (e.g., `db_collection`, `text_content`).

## Import Patterns

### Import Order
1. Standard library modules (e.g., `os`, `threading`, `json`).
2. Third-party/external dependencies (e.g., `fastapi`, `chromadb`, `pydantic`).
3. Internal application modules, using absolute paths from the `app` root (e.g., `from app.crud.crud_collection import ...`).

### Module/Package Organization
- Imports are absolute from the project root (`app`) for clarity and robustness.
- Relative imports are strictly avoided.

## Code Structure Patterns

### Module/Class Organization
1.  Imports (ordered by importance/standard library).
2.  Global constants/configurations.
3.  Class definitions (using the Singleton pattern for managers).
4.  Function definitions (with type hints).
5.  FastAPI routers (instantiation and path operations).

### Function/Method Organization
- Single Responsibility: Each function performs one logical task.
- Dependency Injection: FastAPI's `Depends` system is used to provide DB connections and services.
- Context Managers: `get_db_connection` is used with the `with` statement for automatic resource management.

## Code Organization Principles

1. **Layered Separation**: Clear boundaries between API (routers), logic (internal), and data (crud).
2. **Singleton Managers**: Centralized management for resource-heavy components (Embedding, MCP).
3. **Pydantic Validation**: All external input/output is validated via typed schemas.
4. **Testability**: Structure favors dependency injection to facilitate mocking in the `tests/` directory.

## Restrictions
- Do not include system-generated directories like `__pycache__`, `.venv`, or `.pytest_cache` in this structural map.
- Only project-source directories and essential configuration files are tracked.
