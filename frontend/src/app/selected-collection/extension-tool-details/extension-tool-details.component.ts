import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExtensionsService } from '../../client/services/ExtensionsService';
import { ExtensionTool } from '../../client/models/ExtensionTool';
import { SupportedCommand } from '../../client/models/SupportedCommand';
import { RunExtensionToolCommandDialogComponent } from '../run-extension-tool-command-dialog/run-extension-tool-command-dialog.component';

@Component({
  selector: 'app-extension-tool-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './extension-tool-details.component.html',
  styleUrl: './extension-tool-details.component.scss',
})
export class ExtensionToolDetailsComponent implements OnChanges {
  @Input() toolId: string | null = null;

  tool = signal<ExtensionTool | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toolId'] && this.toolId) {
      this.fetchToolDetails();
    }
  }

  fetchToolDetails(): void {
    if (!this.toolId) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.tool.set(null);

    ExtensionsService.getConnectedExtensionToolsExtensionsConnectedToolsGet()
      .then(tools => {
        const found = tools.find(t => t.client_id === this.toolId);
        if (found) {
          this.tool.set(found);
        } else {
          this.error.set('Tool not found.');
        }
      })
      .catch((err: any) => {
        console.error('Failed to fetch tool details', err);
        this.error.set('Failed to load tool details.');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  onRunCommand(command: SupportedCommand): void {
    if (!this.tool()) return;

    this.dialog.open(RunExtensionToolCommandDialogComponent, {
      data: {
        extension_id: this.tool()!.client_id,
        command: command
      }
    });
  }
}
