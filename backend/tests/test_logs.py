import sys
import os
from fastapi.testclient import TestClient
import pytest
from app.database import get_db_connection, create_tables
from app.crud.crud_log import create_log

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app

client = TestClient(app)

@pytest.fixture(scope="module")
def db_connection():
    # For tests, we can use an in-memory SQLite database
    # or a temporary file-based database.
    # For simplicity, we'll continue with the same DB as the app
    # but ensure tables are created.
    create_tables()
    conn = get_db_connection()
    
    # Clean up logs table before test
    cursor = conn.cursor()
    cursor.execute("DELETE FROM logs")
    conn.commit()

    # Create some test data
    for i in range(15):
        create_log(conn, f"coll_id_{i}", f"coll_name_{i}", "test", f"test message {i}")
    yield conn
    # Teardown: close connection, maybe clean up db.
    conn.close()

def test_read_logs_default(db_connection):
    response = client.get("/logs/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 10

def test_read_logs_with_n_parameter(db_connection):
    response = client.get("/logs/?n=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 5

def test_read_logs_with_large_n(db_connection):
    response = client.get("/logs/?n=20")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # We only created 15 log entries
    assert len(data) == 15
