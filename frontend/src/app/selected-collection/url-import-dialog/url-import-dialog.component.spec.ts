import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlImportDialog } from './url-import-dialog.ts';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UrlImportDialog', () => {
  let component: UrlImportDialog;
  let fixture: ComponentFixture<UrlImportDialog>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<UrlImportDialog>>;

  const dialogData = {
    collectionName: 'Test Collection',
    collectionId: '123',
    model: 'test-model',
    settings: {
      chunk_size: 100,
      chunk_overlap: 20,
      no_chunks: false,
    },
    saved: false,
    twoStepImport: false,
  };

  beforeEach(async () => {
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        UrlImportDialog, // Import the standalone component directly
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlImportDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.importForm.get('model')?.value).toBe(dialogData.model);
    expect(component.importForm.get('chunkSize')?.value).toBe(dialogData.settings.chunk_size);
    expect(component.importForm.get('chunkOverlap')?.value).toBe(dialogData.settings.chunk_overlap);
    expect(component.importForm.get('url')?.value).toBe('');
    expect(component.importForm.get('no_chunks')?.value).toBe(false);
    expect(component.importForm.get('filterEnabled')?.value).toBe(false);
    expect(component.importForm.get('urlFilterRegex')?.value).toBe('');
    expect(component.importForm.get('urlFilterRegex')?.disabled).toBe(true);
  });

  it('should enable urlFilterRegex when filterEnabled is checked', () => {
    component.filterEnabled.setValue(true);
    fixture.detectChanges();
    expect(component.urlFilterRegex.enabled).toBe(true);
    expect(component.urlFilterRegex.hasValidator(component['regexValidator'])).toBe(true);
    expect(component.urlFilterRegex.hasValidator(Validators.required)).toBe(true);
  });

  it('should disable urlFilterRegex when filterEnabled is unchecked', () => {
    component.filterEnabled.setValue(true); // Enable first
    fixture.detectChanges();
    component.filterEnabled.setValue(false); // Then disable
    fixture.detectChanges();
    expect(component.urlFilterRegex.disabled).toBe(true);
    expect(component.urlFilterRegex.value).toBe('');
    expect(component.urlFilterRegex.hasValidator(component['regexValidator'])).toBe(false);
    expect(component.urlFilterRegex.hasValidator(Validators.required)).toBe(false);
  });

  it('should validate valid regex patterns', () => {
    component.filterEnabled.setValue(true);
    component.urlFilterRegex.setValue('^test.*$');
    expect(component.urlFilterRegex.valid).toBe(true);
    expect(component.urlFilterRegex.hasError('invalidRegex')).toBe(false);
  });

  it('should invalidate invalid regex patterns', () => {
    component.filterEnabled.setValue(true);
    component.urlFilterRegex.setValue('[abc'); // Invalid regex
    expect(component.urlFilterRegex.invalid).toBe(true);
    expect(component.urlFilterRegex.hasError('invalidRegex')).toBe(true);
  });

  it('should require urlFilterRegex when filterEnabled is true', () => {
    component.filterEnabled.setValue(true);
    component.urlFilterRegex.setValue('');
    expect(component.urlFilterRegex.invalid).toBe(true);
    expect(component.urlFilterRegex.hasError('required')).toBe(true);
  });


  it('should close dialog with correct data when form is valid and filter is disabled', () => {
    component.importForm.patchValue({
      url: 'http://example.com',
      model: 'another-model',
      chunkSize: 200,
      chunkOverlap: 50,
      no_chunks: true,
      filterEnabled: false,
      urlFilterRegex: '', // Ensure it's cleared if disabled
    });
    fixture.detectChanges();

    component.onImportClick();

    expect(mockMatDialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({
      model: 'another-model',
      url: 'http://example.com',
      collectionId: dialogData.collectionId,
      settings: {
        chunk_size: 200,
        chunk_overlap: 50,
        no_chunks: true,
      },
      urlFilterRegex: null, // Expect null when disabled
    }));
  });

  it('should close dialog with correct data when form is valid and filter is enabled with a regex', () => {
    const testRegex = '.*\.pdf$';
    component.importForm.patchValue({
      url: 'http://example.com/data.pdf',
      model: 'another-model',
      chunkSize: 200,
      chunkOverlap: 50,
      no_chunks: false,
      filterEnabled: true,
      urlFilterRegex: testRegex,
    });
    fixture.detectChanges();

    component.onImportClick();

    expect(mockMatDialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({
      model: 'another-model',
      url: 'http://example.com/data.pdf',
      collectionId: dialogData.collectionId,
      settings: {
        chunk_size: 200,
        chunk_overlap: 50,
        no_chunks: false,
        urlFilterRegex: testRegex, // Expect regex in settings
      },
      urlFilterRegex: testRegex, // Expect regex in top-level object
    }));
  });
});
