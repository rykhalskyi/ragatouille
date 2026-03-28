from enum import Enum

from pydantic import BaseModel

class SummaryType(Enum):
    CHUNKS = 0
    CHAPTER = 1
    BOOK = 2
    TOC = 3

class Summary(BaseModel):
    id: str
    collection_id: str
    type: SummaryType
    summary: str
    metadata: str | None = None