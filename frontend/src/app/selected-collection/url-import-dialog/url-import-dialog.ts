import { Component, Inject, OnInit, signal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { FileImportSettings } from '../../client';
import { MatInput } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';


@UntilDestroy()
@Component({
  selector: 'app-url-import-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatError,
    MatLabel,
    MatCheckboxModule
  ],
  templateUrl: './url-import-dialog.html',
  styleUrl: './url-import-dialog.scss',
})
export class UrlImportDialog implements OnInit {
  importForm!: FormGroup;
  showProgressBar = signal(false);
  infoString = signal<string>("");

  constructor(
    public dialogRef: MatDialogRef<UrlImportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      collectionName: string, 
      collectionId: string, 
      model: string, 
      settings: FileImportSettings,
      saved: boolean,
      twoStepImport: boolean
    },
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.importForm = this.fb.group({
      model: [this.data.model, Validators.required],
      chunkSize: [this.data.settings.chunk_size, [Validators.required, Validators.min(1)]],
      chunkOverlap: [this.data.settings.chunk_overlap, [Validators.required, Validators.min(0)]],
      url: ['', Validators.required],
      no_chunks: false,
      filterEnabled: false,
      urlFilterRegex: [{ value: "", disabled: true }]
    });

    this.importForm.get('filterEnabled')?.valueChanges.pipe(untilDestroyed(this)).subscribe(enabled => {
      const urlFilterRegexControl = this.importForm.get('urlFilterRegex');
      if (enabled) {
        urlFilterRegexControl?.enable();
        urlFilterRegexControl?.setValidators(Validators.required);
      } else {
        urlFilterRegexControl?.disable();
        urlFilterRegexControl?.setValue("");
        urlFilterRegexControl?.clearValidators();
      }
      urlFilterRegexControl?.updateValueAndValidity();
    });

    //if (this.data.saved)
      this.importForm.get('model')?.disable()


  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onImportClick(): void {
    if (this.importForm.valid) {
      this.dialogRef.close({
        ...this.importForm.getRawValue(),
        collectionId: this.data.collectionId,
      });
    }
  }

  // Placeholder for now, will be updated when service logic is in place
  onImportSubmit(): void {
    this.onImportClick();
  }
}

