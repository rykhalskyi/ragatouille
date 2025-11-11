import threading
import queue
import uuid
import time
from app.crud import crud_task

class BackgroundTaskDispatcher:
    def __init__(self, num_workers=4):
        self.task_queue = queue.Queue()
        self.num_workers = num_workers
        self.workers = []
        self._start_workers()

    def _start_workers(self):
        for _ in range(self.num_workers):
            worker = threading.Thread(target=self._worker_main)
            worker.daemon = True
            worker.start()
            self.workers.append(worker)

    def _worker_main(self):
        while True:
            task_id, task_func, args, kwargs = self.task_queue.get()
            if task_id is None:
                break
            try:
                crud_task.update_task_status(task_id, "RUNNING")
                task_func(*args, **kwargs)
            except Exception as e:
                print(f"Task {task_id} failed: {e}")
            finally:
                self.task_queue.task_done()

    def enqueue_task(self, collection_id: str, task_name: str, task_func, *args, **kwargs):
        task_id = str(uuid.uuid4())
        start_time = int(time.time())
        crud_task.create_task(task_id, collection_id, task_name, start_time, "NEW")
        self.task_queue.put((task_id, task_func, args, kwargs))
        return task_id

    def cancel_task(self, task_id: str):
        # This is a simplified cancellation. It only removes the task from the database.
        # The running thread is not terminated.
        crud_task.delete_task(task_id)

    def stop(self):
        for _ in range(self.num_workers):
            self.task_queue.put((None, None, None, None))
        for worker in self.workers:
            worker.join()
