import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { Checklist } from '../interfaces/checklist';
import { of } from 'rxjs';
import { ChecklistItem } from '../interfaces/checklist-item';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  loadChecklists() {
    const checklists = this.storage.getItem('checklists');
    return of(checklists ? (JSON.parse(checklists) as Checklist[]) : []);
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem('checklists', JSON.stringify(checklists));
  }

  loadChecklistItems() {
    const checklistsItems = this.storage.getItem('checklistItems');
    return of(
      checklistsItems ? (JSON.parse(checklistsItems) as ChecklistItem[]) : []
    );
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    this.storage.setItem('checklistItems', JSON.stringify(checklistItems));
  }
}
