# Code Style and Best Practices

# Foundational Principles

This project adheres to established software engineering principles to ensure the codebase is robust, maintainable, and scalable.

*   **KISS (Keep It Simple, Stupid):** The overall architecture and implementation favor straightforward solutions (e.g., using SQLite/ChromaDB directly) over complex ones.
*   **DRY (Don't Repeat Yourself):** Logic is centralized in CRUD modules and internal managers.
*   **Separation of Concerns:** Clear separation between API routers, internal logic managers, and data access layers.
*   **Singleton Pattern:** Core services like `MCPManager` and `TextEmbedding` are singletons to ensure efficient resource usage and consistent state.

---

# Specific Guidelines

## Guideline: Consistent MCP Tool Responses

**Problem:**
Returning inconsistent data structures from MCP tools makes it difficult for agents to parse results and handle errors gracefully.

```python
# What to avoid
@mcp_server.tool()
def add_fact(fact, summary):
    # Missing status/message standard
    store_fact(fact, summary)
    return "Done"
```

**Recommendation:**
Always return a dictionary with a `status` key and a `message` or `results` key.

1.  **Use status keys**: "success" or "error".
2.  **Include descriptive messages**: Help the agent understand what happened.
3.  **Return detailed results**: When querying data, use a `results` key.

```python
@mcp_server.tool()
def add_fact(fact: str, summary: str) -> dict:
    try:
        # Business logic here...
        return {"status": "success", "message": "Fact saved to agent_ltm."}
    except Exception as e:
        return {"status": "error", "message": str(e)}
```

**Rationale:**
Standardized responses allow calling agents to programmatically handle success/failure scenarios and improve the overall reliability of agent-to-tool interactions.

---

## Guideline: Thread-Safe Singleton Managers

**Problem:**
Directly instantiating resource-heavy classes (like embedding models or MCP servers) in multiple places can lead to race conditions, excessive memory usage, and inconsistent state.

**Recommendation:**
Use a thread-safe Singleton pattern for all internal managers.

1.  **Implement `_instance` and `_lock`**:
    ```python
    class MCPManager:
        _instance = None
        _lock = threading.Lock()

        def __new__(cls):
            if cls._instance is None:
                with cls._lock:
                    if cls._instance is None:
                        cls._instance = super().__new__(cls)
                        cls._instance._initialize()
            return cls._instance
    ```
2.  **Use `_initialize()`**: Separate construction from one-time setup logic.

**Rationale:**
This ensures that expensive resources (like GPU/CPU embedding models) are loaded only once and that global state (like the MCP server's enabled/disabled status) is consistent across all API requests.

---

## Guideline: Typed and Validated Data Models with Pydantic

**Problem:**
Passing raw dictionaries between API layers can lead to runtime errors and poor developer experience.

**Recommendation:**
Define clear, typed data models using Pydantic for all API inputs and outputs.

```python
# in app/schemas/collection.py
class CollectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    enabled: bool = True
```

**Rationale:**
Pydantic provides automatic data validation, reduces boilerplate, and improves API documentation.

---

## Guideline: Consistent Naming Conventions

**Recommendation:**
Adhere to the following PEP 8-inspired naming conventions:

*   **Files/Modules:** `snake_case.py` (e.g., `crud_collection.py`).
*   **Classes:** `PascalCase` (e.g., `MessageHub`, `CollectionCreate`).
*   **Functions/Methods:** `snake_case()` (e.g., `get_collections`, `add_fact`).
*   **Variables:** `snake_case` (e.g., `db_connection`, `text_content`).

**Rationale:**
Consistency makes the codebase predictable and easier to navigate for new contributors.
