import unittest
from unittest.mock import patch, MagicMock
import time
from app.internal.background_task_dispatcher import BackgroundTaskDispatcher

def dummy_task(x, y):
    return x + y

class TestBackgroundTaskDispatcher(unittest.TestCase):
    def test_enqueue_task(self):
        with patch('app.internal.background_task_dispatcher.crud_task') as mock_crud_task:
            dispatcher = BackgroundTaskDispatcher(num_workers=1)
            
            collection_id = "test_collection"
            task_name = "test_task"
            
            task_id = dispatcher.enqueue_task(collection_id, task_name, dummy_task, 1, 2)
            
            self.assertIsNotNone(task_id)
            mock_crud_task.create_task.assert_called_once()
            
            # Give the worker time to process the task
            time.sleep(0.1)
            
            mock_crud_task.update_task_status.assert_called_with(task_id, "RUNNING")
            
            dispatcher.stop()

    def test_cancel_task(self):
        with patch('app.internal.background_task_dispatcher.crud_task') as mock_crud_task:
            dispatcher = BackgroundTaskDispatcher(num_workers=1)
            
            collection_id = "test_collection"
            task_name = "test_task"
            
            task_id = dispatcher.enqueue_task(collection_id, task_name, dummy_task, 1, 2)
            
            dispatcher.cancel_task(task_id)
            
            mock_crud_task.delete_task.assert_called_with(task_id)
            
            dispatcher.stop()

if __name__ == '__main__':
    unittest.main()
