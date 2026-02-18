import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from app.main import app as fastapi_app
from app.dependencies import get_extension_manager

@pytest.fixture
def client():
    with TestClient(fastapi_app) as c:
        yield c

def test_call_tool_success(client):
    mock_manager = AsyncMock()
    mock_manager.send_command_and_wait_for_response.return_value = {
        "payload": {"result": "ok"},
        "correlation_id": "test-id"
    }
    
    # Override the dependency
    fastapi_app.dependency_overrides[get_extension_manager] = lambda: mock_manager
    
    try:
        response = client.post("/extensions/call_tool", json={
            "extension_id": "ext1",
            "command_name": "cmd1",
            "arguments": {"arg1": "val1"}
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["result"] == {"result": "ok"}
        
        mock_manager.send_command_and_wait_for_response.assert_called_once_with(
            "ext1", "cmd1", {"arg1": "val1"}, timeout=10
        )
    finally:
        fastapi_app.dependency_overrides.clear()

def test_call_tool_not_found(client):
    mock_manager = AsyncMock()
    mock_manager.send_command_and_wait_for_response.side_effect = ConnectionError("Client ext1 not found")
    
    fastapi_app.dependency_overrides[get_extension_manager] = lambda: mock_manager
    
    try:
        response = client.post("/extensions/call_tool", json={
            "extension_id": "ext1",
            "command_name": "cmd1",
            "arguments": {}
        })
        
        assert response.status_code == 404
        assert "Client ext1 not found" in response.json()["detail"]
    finally:
        fastapi_app.dependency_overrides.clear()

def test_call_tool_timeout(client):
    mock_manager = AsyncMock()
    # In Python 3.11+ TimeoutError is built-in and asyncio.TimeoutError is an alias
    mock_manager.send_command_and_wait_for_response.side_effect = TimeoutError("Timed out")
    
    fastapi_app.dependency_overrides[get_extension_manager] = lambda: mock_manager
    
    try:
        response = client.post("/extensions/call_tool", json={
            "extension_id": "ext1",
            "command_name": "cmd1",
            "arguments": {}
        })
        
        assert response.status_code == 408
        assert "Timed out" in response.json()["detail"]
    finally:
        fastapi_app.dependency_overrides.clear()

def test_call_tool_internal_error(client):
    mock_manager = AsyncMock()
    mock_manager.send_command_and_wait_for_response.side_effect = Exception("Unexpected error")
    
    fastapi_app.dependency_overrides[get_extension_manager] = lambda: mock_manager
    
    try:
        response = client.post("/extensions/call_tool", json={
            "extension_id": "ext1",
            "command_name": "cmd1",
            "arguments": {}
        })
        
        assert response.status_code == 500
        assert "Unexpected error" in response.json()["detail"]
    finally:
        fastapi_app.dependency_overrides.clear()
