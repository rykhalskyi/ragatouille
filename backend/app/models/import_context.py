from sqlite3 import Connection
from typing import List

from app.internal.message_hub import MessageHub
from app.schemas.imports import Import
from app.schemas.setting import Setting


class ImportContext:
    dbConnection: Connection
    messageHub: MessageHub
    settings: List[Setting]
    parameters: Import

    def __init__(self, dbConnection: Connection, messageHub: MessageHub, settings: List[Setting], parameters: Import):
        self.dbCOnnectin = dbConnection
        self.messageHub = messageHub
        self.settings = settings
        self.parameters = parameters
