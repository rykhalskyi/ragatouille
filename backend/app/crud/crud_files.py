from sqlite3 import Connection
import sqlite3
from typing import List
import uuid

from app.schemas.file import File


def create_file(db: Connection, collection_id: str, path: str, source: str):
    id = str(uuid.uuid4())
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO files (id, collectionId, path, source) VALUES (?, ?, ?, ?)",
        (id, collection_id, path, source),
    )
    db.commit()

def get_files_for_collection(db: Connection, collection_id: str) -> List[File]:
    cursor = db.execute("SELECT id, timestamp, collection_id, path, source FROM files WHERE colection_id=?", str(collection_id))
    db.row_factory = sqlite3.Row
    files_rows = cursor.fetchall()
    return [File(**row) for row in files_rows]

def delete_files_by_collection_id(db: Connection, collection_id: str):
    cursor = db.cursor()
    cursor.execute("DELETE FROM files WHERE collectionId = ?", (collection_id,))
    db.commit()
    if cursor.rowcount == 0:
        return None
    return {"message": "Files deleted successfully"}