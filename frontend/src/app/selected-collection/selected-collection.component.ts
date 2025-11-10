import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionsService } from '../client/services/CollectionsService';
import { Collection } from '../client/models/Collection';
import { MatIconModule } from '@angular/material/icon';
import { CollectionRefreshService } from '../collection-refresh.service';

@Component({
  selector: 'app-selected-collection',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatIconModule],
  templateUrl: './selected-collection.component.html',
  styleUrl: './selected-collection.component.scss'
})

export class SelectedCollectionComponent implements OnInit {
  collection: Collection | undefined;
  isEnabled: boolean = false;
  isEditingDescription = false;
  editedDescription = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private collectionRefreshService: CollectionRefreshService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const collectionId = params.get('collectionId');
      if (collectionId) {
        this.fetchCollectionDetails(collectionId);
      }
    });
  }

  async fetchCollectionDetails(collectionId: string): Promise<void> {
    try {
      this.collection = await CollectionsService.readCollectionCollectionsCollectionIdGet(collectionId);
      this.isEnabled = this.collection?.enabled || false;
    } catch (error) {
      console.error('Error fetching collection details:', error);
    }
  }

  async onToggleChange(): Promise<void> {
    if (this.collection) {
      try {
        await CollectionsService.updateExistingCollectionCollectionsCollectionIdPut(this.collection.id, { name: this.collection.name, enabled: this.isEnabled });
        console.log('Collection enabled status updated.');
        this.collectionRefreshService.triggerRefresh();
      } catch (error) {
        console.error('Error updating collection enabled status:', error);
        this.isEnabled = !this.isEnabled;
      }
    }
  }

  async deleteCollection(): Promise<void> {
    if (this.collection && confirm(`Are you sure you want to delete collection "${this.collection.name}"?`)) {
      try {
        await CollectionsService.deleteExistingCollectionCollectionsCollectionIdDelete(this.collection.id);
        console.log('Collection deleted successfully.');
        this.collectionRefreshService.triggerRefresh();
        this.router.navigate(['/']); 
      } catch (error) {
        console.error('Error deleting collection:', error);
      }
    }
  }

  startEditingDescription(): void {
    this.isEditingDescription = true;
    this.editedDescription = this.collection?.description || '';
  }

  cancelEditingDescription(): void {
    this.isEditingDescription = false;
  }

  async saveDescription(): Promise<void> {
    if (this.collection) {
      try {
        await CollectionsService.updateExistingCollectionCollectionsCollectionIdPut(this.collection.id, {
          name: this.collection.name,
          description: this.editedDescription,
        });
        if(this.collection) {
          this.collection.description = this.editedDescription;
        }
        this.isEditingDescription = false;
        this.collectionRefreshService.triggerRefresh();
      } catch (error) {
        console.error('Error updating collection description:', error);
      }
    }
  }
}
