import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupportedCommand } from '../../client/models/SupportedCommand';
import { ExtensionsService } from '../../client/services/ExtensionsService';
import { CallToolRequest } from '../../client/models/CallToolRequest';

export interface RunExtensionToolCommandData {
  extension_id: string;
  command: SupportedCommand;
}

@Component({
  selector: 'app-run-extension-tool-command-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './run-extension-tool-command-dialog.component.html',
  styleUrl: './run-extension-tool-command-dialog.component.scss'
})
export class RunExtensionToolCommandDialogComponent implements OnInit {
  form: FormGroup;
  schemaProperties: any[] = [];
  output = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<RunExtensionToolCommandDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RunExtensionToolCommandData,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.parseSchema();
  }

  private parseSchema(): void {
    if (!this.data.command.inputSchema) {
      return;
    }

    try {
      // Log raw input so we can see what shape we received
      console.log('raw inputSchema (string):', this.data.command.inputSchema, typeof this.data.command.inputSchema);
      const schema = JSON.parse(this.data.command.inputSchema);
      console.log('parsed schema', schema, 'type:', (schema as any).type);

      // Reset any previous parsed properties
      this.schemaProperties = [];

      // Determine properties shape. Support two formats:
      // 1) Full JSON Schema: { type: 'object', properties: { ... }, required: [...] }
      // 2) Simple map: { fieldName: 'string', other: 'boolean' }
      let properties: any = null;
      if (schema && typeof schema === 'object') {
        if ((schema as any).type === 'object' && (schema as any).properties) {
          properties = (schema as any).properties;
        } else {
          // fallback: the parsed object looks like { prop: 'string', ... }
          const values = Object.values(schema);
          const allStrings = values.length > 0 && values.every(v => typeof v === 'string');
          if (allStrings) {
            properties = {};
            Object.keys(schema).forEach(k => {
              properties[k] = { type: (schema as any)[k], description: k };
            });
          }
        }
      }

      if (properties) {
        const required = (schema && (schema as any).required) || [];
        Object.keys(properties).forEach(key => {
          const prop = properties[key];
          this.schemaProperties.push({
            key,
            type: prop.type,
            description: prop.description || key,
            required: required.includes(key)
          });

          const validators = [];
          if (required.includes(key)) {
            validators.push(Validators.required);
          }

          let defaultValue: any = '';
          if (prop.type === 'boolean') {
            defaultValue = false;
          } else if (prop.type === 'number' || prop.type === 'integer') {
            defaultValue = 0;
          }

          this.form.addControl(key, this.fb.control(defaultValue, validators));
        });
      }
    } catch (e) {
      console.error('Failed to parse inputSchema', e);
      this.output.set('Error parsing command schema.');
    }
  }

  onRun(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.output.set(null);

    const modifiedValues: any = {};
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.dirty) {
        const schemaProp = this.schemaProperties.find(p => p.key === key);
        let value: any = control.value;
        if (schemaProp) {
          if (schemaProp.type === 'number' || schemaProp.type === 'integer') {
            value = Number(value);
          } else if (schemaProp.type === 'boolean') {
            value = Boolean(value);
          }
        }
        modifiedValues[key] = value;
      }
    });

    console.log('form modified values', modifiedValues);
    const request: CallToolRequest = {
      extension_id: this.data.extension_id,
      command_name: this.data.command.name,
      arguments: JSON.stringify(modifiedValues)
    };

    ExtensionsService.callExtensionToolExtensionsCallToolPost(request)
      .then(response => {
        if (response.status === 'success') {
          this.output.set(JSON.stringify(response.result || response.message, null, 2));
        } else {
          this.output.set(`Error: ${response.message}`);
        }
      })
      .catch((err: any) => {
        console.error('Tool call failed', err);
        this.output.set(`Failed to execute command: ${err.message || err}`);
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
