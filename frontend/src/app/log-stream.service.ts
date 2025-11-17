import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LogEntry } from './logs-view/log-entry.interface';
import { environment } from '../environments/environment';
import { LogsService } from './client/services/LogsService'; // Import the generated LogsService

@Injectable({
  providedIn: 'root'
})
export class LogStreamService {
  private logSubject: Subject<LogEntry> = new Subject<LogEntry>();
  public logs$: Observable<LogEntry> = this.logSubject.asObservable();
  private eventSource: EventSource | undefined;
  private readonly SSE_URL = `${environment.apiUrl}/logs/stream`;

  constructor(private ngZone: NgZone) { // Inject LogsService
    this.connect();
  }

  private connect(): void {
    if (typeof EventSource !== 'undefined') {
      // Fetch initial logs
      LogsService.readLogsLogsGet(25)      
        .then(initialLogs => {
          this.ngZone.run(() => {
            initialLogs.forEach(log => this.logSubject.next(log as LogEntry));
          });
        })
        .catch(error => console.error('Error fetching initial logs:', error));

      this.eventSource = new EventSource(this.SSE_URL);

      this.eventSource.onmessage = (event) => {
        this.ngZone.run(() => {
          const data = JSON.parse(event.data);
          this.logSubject.next(data as LogEntry);
        });
      };

      this.eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        this.eventSource?.close();
        setTimeout(() => this.connect(), 5000); // Reconnect after 5 seconds
      };

      this.eventSource.onopen = () => {
        console.log('SSE connection opened.');
      };
    } else {
      console.warn('EventSource is not supported in this browser.');
    }
  }

  closeConnection(): void {
    this.eventSource?.close();
    console.log('SSE connection closed.');
  }
}
