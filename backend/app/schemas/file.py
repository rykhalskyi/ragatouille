from pydantic import BaseModel

class File(BaseModel):
    id: str
    timestamp: int
    collectionId: str
    path: str
    source: str