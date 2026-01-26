import pytest
from pydantic import ValidationError
from app.schemas.mcp import SupportedCommand, ExtensionTool
import json

def test_supported_command_valid():
    """Tests successful creation of a SupportedCommand."""
    data = {
        "name": "test_command",
        "description": "A test command.",
        "inputSchema": json.dumps({"type": "object"})
    }
    cmd = SupportedCommand(**data)
    assert cmd.name == data["name"]
    assert cmd.description == data["description"]
    assert cmd.inputSchema == data["inputSchema"]

def test_supported_command_missing_fields():
    """Tests that SupportedCommand raises ValidationError for missing fields."""
    with pytest.raises(ValidationError):
        SupportedCommand(name="test_command")

def test_extension_tool_valid():
    """Tests successful creation of an ExtensionTool."""
    cmd_data = {
        "name": "test_command",
        "description": "A test command.",
        "inputSchema": json.dumps({"type": "object"})
    }
    tool_data = {
        "client_id": "test_client_123",
        "application_name": "TestApp",
        "user_entity_name": "TestEntity",
        "supported_commands": [cmd_data]
    }
    tool = ExtensionTool(**tool_data)
    assert tool.client_id == tool_data["client_id"]
    assert tool.application_name == tool_data["application_name"]
    assert tool.user_entity_name == tool_data["user_entity_name"]
    assert len(tool.supported_commands) == 1
    assert tool.supported_commands[0].name == cmd_data["name"]

def test_extension_tool_empty_commands():
    """Tests that ExtensionTool can be created with an empty list of commands."""
    tool_data = {
        "client_id": "test_client_456",
        "application_name": "TestAppEmpty",
        "user_entity_name": "TestEntityEmpty",
        "supported_commands": []
    }
    tool = ExtensionTool(**tool_data)
    assert tool.client_id == tool_data["client_id"]
    assert tool.application_name == tool_data["application_name"]
    assert tool.user_entity_name == tool_data["user_entity_name"]
    assert len(tool.supported_commands) == 0

def test_extension_tool_missing_fields():
    """Tests that ExtensionTool raises ValidationError for missing fields."""
    with pytest.raises(ValidationError):
        ExtensionTool(client_id="test_client")

def test_extension_tool_invalid_command_type():
    """Tests that ExtensionTool raises ValidationError for invalid command types."""
    tool_data = {
        "client_id": "test_client_789",
        "application_name": "TestAppInvalid",
        "user_entity_name": "TestEntityInvalid",
        "supported_commands": ["not_a_command"]
    }
    with pytest.raises(ValidationError):
        ExtensionTool(**tool_data)
