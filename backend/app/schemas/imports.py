from typing import Optional, List
from pydantic import BaseModel, Json
from app.internal.chunker import ChunkType

class FileImportSettings(BaseModel):
    chunk_size: int
    chunk_overlap: int
    no_chunks: bool
    chunk_type: Optional[ChunkType] = ChunkType.DEFAULT
    filter: Optional[str] = None

class UrlImportSettings(FileImportSettings):
    url: str

class Import(BaseModel):
    name: str
    model: str
    settings: FileImportSettings

class ImportFileStep2In(BaseModel):
    import_files_ids: Json[List[str]]
    import_params: str
