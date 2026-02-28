import pytest
import asyncio
import numpy as np
from unittest.mock import MagicMock, AsyncMock, patch

from app.internal.tools import register_tools

@pytest.fixture
def mcp_manager():
    manager = MagicMock()
    manager.is_enabled.return_value = True
    return manager

@pytest.fixture
def captured_tools(mcp_manager):
    tools = {}
    
    class MockMcpServer:
        def tool(self, name=None):
            def decorator(func):
                tools[func.__name__] = func
                return func
            return decorator

    mock_server = MockMcpServer()
    register_tools(mock_server, mcp_manager)
    return tools

@pytest.mark.asyncio
class TestCallExtensionTool:

    @patch('app.internal.tools.ExtensionManager')
    async def test_call_extension_tool_success(self, MockExtensionManager, captured_tools):
        # Arrange
        call_extension_func = captured_tools['call_extension']
        mock_manager_instance = MockExtensionManager.return_value
        mock_manager_instance.send_command_and_wait_for_response = AsyncMock(return_value={"status": "success", "data": "result"})

        # Act
        result = await call_extension_func(id="ext_id", name="command_name", input={"key": "value"})

        # Assert
        assert result == {"status": "success", "data": "result"}
        mock_manager_instance.send_command_and_wait_for_response.assert_called_once_with(
            "ext_id", "command_name", {"key": "value"}, timeout=10
        )

    @patch('app.internal.tools.ExtensionManager')
    async def test_call_extension_connection_error(self, MockExtensionManager, captured_tools):
        # Arrange
        call_extension_func = captured_tools['call_extension']
        mock_manager_instance = MockExtensionManager.return_value
        mock_manager_instance.send_command_and_wait_for_response.side_effect = ConnectionError("Extension not found")
        
        # Act
        result = await call_extension_func(id="ext_id", name="command_name", input={"key": "value"})

        # Assert
        assert result == {"status": "error", "message": "Extension not found"}

    @patch('app.internal.tools.ExtensionManager')
    async def test_call_extension_timeout_error(self, MockExtensionManager, captured_tools):
        # Arrange
        call_extension_func = captured_tools['call_extension']
        mock_manager_instance = MockExtensionManager.return_value
        mock_manager_instance.send_command_and_wait_for_response.side_effect = asyncio.TimeoutError
        
        # Act
        result = await call_extension_func(id="ext_id", name="command_name", input={"key": "value"})

        # Assert
        assert result == {"status": "error", "message": "Command 'command_name' on extension 'ext_id' timed out after 10 seconds."}

    async def test_call_extension_missing_params(self, captured_tools):
        # Arrange
        call_extension_func = captured_tools['call_extension']
        
        # Act
        result_id = await call_extension_func(id=None, name="command_name", input={"key": "value"})
        result_name = await call_extension_func(id="ext_id", name=None, input={"key": "value"})
        result_input = await call_extension_func(id="ext_id", name="command_name", input=None)

        # Assert
        message = {"status": "error", "message": "Missing required parameters: id, name, or input."}
        assert result_id == message
        assert result_name == message
        assert result_input == message
        
    async def test_call_extension_mcp_disabled(self, captured_tools, mcp_manager):
        # Arrange
        mcp_manager.is_enabled.return_value = False
        # We need to re-register the tools to capture the correct state
        tools = {}
    
        class MockMcpServer:
            def tool(self, name=None):
                def decorator(func):
                    tools[func.__name__] = func
                    return func
                return decorator

        mock_server = MockMcpServer()
        register_tools(mock_server, mcp_manager)
        call_extension_func = tools['call_extension']

        # Act
        result = await call_extension_func(id="ext_id", name="command_name", input={"key": "value"})
        
        # Assert
        assert result == {"status": "error", "message": "MCP server is disabled."}

class TestAddFactTool:

    @patch('app.internal.tools.get_db_connection')
    @patch('app.internal.tools.get_collection_by_name')
    @patch('app.internal.tools.create_collection')
    @patch('app.internal.tools.chromadb.PersistentClient')
    @patch('app.internal.tools.get_embedder')
    def test_add_fact_success(self, mock_get_embedder, mock_chroma_client, mock_create_collection, mock_get_collection_by_name, mock_get_db, captured_tools):
        # Arrange
        add_fact_func = captured_tools['add_fact']
        mock_get_collection_by_name.return_value = None # Simulate collection missing
        
        mock_db = MagicMock()
        mock_get_db.return_value.__enter__.return_value = mock_db
        
        mock_collection = MagicMock()
        mock_chroma_client.return_value.get_collection.return_value = mock_collection
        
        mock_embedder = MagicMock()
        mock_get_embedder.return_value = mock_embedder
        mock_embedder.embed.return_value = iter([np.array([0.1, 0.2, 0.3])])

        # Act
        result = add_fact_func(fact="User likes pizza", summary="User's food preference")

        # Assert
        assert result["status"] == "success"
        mock_create_collection.assert_called_once()
        mock_collection.add.assert_called_once()
        args, kwargs = mock_collection.add.call_args
        assert kwargs['documents'] == ["User likes pizza"]
        assert kwargs['metadatas'][0]['summary'] == "User's food preference"
        assert 'embeddings' in kwargs

    def test_add_fact_mcp_disabled(self, captured_tools, mcp_manager):
        # Arrange
        mcp_manager.is_enabled.return_value = False
        tools = {}
        class MockMcpServer:
            def tool(self, name=None):
                def decorator(func):
                    tools[func.__name__] = func
                    return func
                return decorator
        register_tools(MockMcpServer(), mcp_manager)
        add_fact_func = tools['add_fact']

        # Act
        result = add_fact_func(fact="User likes pizza", summary="User's food preference")
        
        # Assert
        assert result == {"status": "error", "message": "MCP server is disabled."}
