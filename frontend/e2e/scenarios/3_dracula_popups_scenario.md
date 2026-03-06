### Once Before tests [ ]
    * if 'Dracula_2' exists in 'collections list':
        - click 'collection-item'
        - click 'delete icon'
        - click 'delete-confirm-button'

### 1. Add Dracula_2 collecion []
    (import trcording from e2e\scenarios\dracula_2_record.json)

### 2. Import and remove files [ ]
- click 'import-step-1-button'
- click "div.mat-mdc-dialog-content span.mdc-button__label"
- input to "div.row1 input" 'C:\fakepath\dracula.txt'
- click 'import-file-submit-button'
* button shown 'import-step-2-button'
- click "Delete Files"
* button hidden 'import-step-2-button'

### 3. Inspect collection []
- click 'collection-item-Dracula_2'
- click "app-collection-details span.mdc-button__label"
- click "div.cdk-overlay-container button:nth-of-type(2) > span.mdc-button__label"
- click "div.cdk-overlay-container button:nth-of-type(2) > span.mdc-button__label"
- click "div.cdk-overlay-container button:nth-of-type(2) > span.mdc-button__label"
- click "div.mat-mdc-dialog-content button:nth-of-type(1) > span.mdc-button__label"
- click "#mat-tab-group-1-label-1 > span.mdc-tab__content"
- click "aria/Your query"
- input to "aria/Your query" 'Mina curse'
- click "div.mat-mdc-dialog-content span.mdc-button__label"
- click "div.cdk-overlay-container button:nth-of-type(2) > span.mat-mdc-button-touch-target"
- click "div.mat-mdc-dialog-actions span.mat-mdc-button-touch-target"