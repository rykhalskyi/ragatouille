from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class MCPEnabledRequest(BaseModel):
    enabled: bool

class Message(BaseModel):
    id: str
    timestamp: datetime
    collectionId: Optional[str] = None
    topic: str
    message: str

class SupportedCommand(BaseModel):
    name: str
    description: str
    inputSchema: Optional[str]

class ExtensionTool(BaseModel):
    client_id: str
    application_name: str
    user_entity_name: str
    supported_commands: List[SupportedCommand]

class CallToolRequest(BaseModel):
    extension_id: str
    command_name: str
    arguments: str

class CallToolResponse(BaseModel):
    status: str
    message: Optional[str] = None
    result: Optional[Any] = None
