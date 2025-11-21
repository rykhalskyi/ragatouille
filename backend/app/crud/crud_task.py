import sqlite3
from typing import List
from app.database import get_db_connection
from app.schemas.task import Task

def create_task(task_id: str, collection_id: str, name: str, start_time: int, status: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tasks (id, collectionId, name, startTime, status) VALUES (?, ?, ?, ?, ?)",
        (task_id, collection_id, name, start_time, status),
    )
    conn.commit()
    conn.close()

def get_task(task_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    task = cursor.fetchone()
    conn.close()
    return task

def update_task_status(task_id: str, status: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE tasks SET status = ? WHERE id = ?", (status, task_id))
    conn.commit()
    conn.close()

def delete_task(task_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()

def get_all_tasks() -> List[Task]:
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT id, collectionId, name, startTime, status FROM tasks")
    tasks = cursor.fetchall()
    conn.close()
    return [Task(**task) for task in tasks ]

def delete_all_tasks():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks")
    conn.commit()
    conn.close()