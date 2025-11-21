from sqlite3 import Connection
import threading
import uuid
from app.crud import crud_log
from app.models.messages import MessageType
from app.schemas.mcp import Message
import queue
from datetime import datetime

class MessageHub:
    def __init__(self, db:Connection):
        self.message_queue = queue.Queue()
        self.db = db
        self.id = uuid.uuid4()
        print('create mh', self.id)

    def send_task_message(self, message:str):
        self.send_message("","",MessageType.TASK, message)

    def send_message(self, collection_id: str, collection_name: str, topic: MessageType, message: str):
        
        if topic == MessageType.LOG:
            log_message = crud_log.create_log(self.db, collection_id, collection_name, topic.name, message)
            self.message_queue.put(log_message)
        else:
            msg = Message(
                id=str(uuid.uuid4()),
                timestamp=datetime.now(),
                collectionId=collection_id, 
                collectionName=collection_name,
                topic=topic.name,
                message=message)
            self.message_queue.put(msg)

    def get_message(self) -> Message:
      msg = self.message_queue.get()
      print("GET popped", self.id, msg.topic, msg.message, threading.get_ident())
      return msg
