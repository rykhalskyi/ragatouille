import { Injectable } from '@angular/core';
import { Import } from './client/models/Import';

@Injectable({
  providedIn: 'root'
})
export class ImportFormStateService {
  private formState: Map<string, Import> = new Map();

  constructor() { }

  getState(collectionId: string): Import | undefined {
    return this.formState.get(collectionId);
  }

  setState(collectionId: string, state: Import): void {
    this.formState.set(collectionId, state);
  }

  clearState(collectionId: string): void {
    this.formState.delete(collectionId);
  }
}