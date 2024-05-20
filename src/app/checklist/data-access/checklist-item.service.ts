import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  DeleteChecklistItem,
  ResetChecklist,
  ToggleChecklistItem,
} from '../../shared/interfaces/checklist-item';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from '../../shared/data-access/storage.service';
import { DeleteChecklist } from '../../shared/interfaces/checklist';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  storageService = inject(StorageService);

  //state
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
  });

  //selectors
  checklistItems = computed(() => this.state().checklistItems);
  loaded = computed(() => this.state().loaded);

  //sources
  add$ = new Subject<AddChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  delete$ = new Subject<DeleteChecklistItem>();
  toggle$ = new Subject<ToggleChecklistItem>();
  reset$ = new Subject<ResetChecklist>();
  private checklistItemsLoaded$ = this.storageService.loadChecklistItems();
  checklistDeleted$ = new Subject<DeleteChecklist>();

  constructor() {
    effect(() => {
      if (this.loaded())
        this.storageService.saveChecklistItems(this.checklistItems());
    });

    //reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...checklistItem.item,
            id: Date.now().toString(),
            checklistId: checklistItem.checklistId,
            checked: false,
          },
        ],
      }))
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((updatedItem) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((checklistItem) =>
          checklistItem.id === updatedItem.id
            ? { ...checklistItem, title: updatedItem.data.title }
            : checklistItem
        ),
      }))
    );

    this.delete$.pipe(takeUntilDestroyed()).subscribe((checklistItemId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.filter(
          (checklistItem) => checklistItem.id != checklistItemId
        ),
      }))
    );

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((checklistItemId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === checklistItemId
            ? { ...item, checked: !item.checked }
            : item
        ),
      }))
    );

    this.reset$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === checklistId ? { ...item, checked: false } : item
        ),
      }))
    );

    this.checklistItemsLoaded$.pipe(takeUntilDestroyed()).subscribe((items) =>
      this.state.update((state) => ({
        ...state,
        items,
        loaded: true,
      }))
    );

    this.checklistDeleted$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.filter(
          (item) => item.checklistId !== checklistId
        ),
      }))
    );
  }
}
