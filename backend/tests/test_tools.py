import pytest
import asyncio
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
