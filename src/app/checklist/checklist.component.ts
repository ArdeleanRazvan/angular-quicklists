import { Component, computed, effect, inject, signal } from '@angular/core';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistHeaderComponent } from './ui/checklist-header.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { FormBuilder } from '@angular/forms';
import { ChecklistItem } from '../shared/interfaces/checklist-item';
import { ModalComponent } from '../shared/ui/modal.component';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { ChecklistItemListComponent } from './ui/checklist-item-list.component';

@Component({
  standalone: true,
  selector: 'app-checklist',
  template: `@if (checklist();as checklist) {
    <app-checklist-header
      [checklist]="checklist"
      (addItem)="checklistItemEdited.set({})"
      (resetChecklist)="checklistItemService.reset$.next($event)"
    ></app-checklist-header>
    <app-checklist-item-list
      [checklistItems]="checklistItemService.checklistItems()"
      (toggle)="checklistItemService.toggle$.next($event)"
      (delete)="checklistItemService.delete$.next($event)"
      (edit)="checklistItemEdited.set($event)"
    ></app-checklist-item-list>
    }
    <app-modal [isOpen]="!!checklistItemEdited()">
      <ng-template>
        <app-form-modal
          title="Create Item"
          [formGroup]="checklistItemForm"
          (save)="
            checklistItemEdited()?.id
              ? checklistItemService.edit$.next({
                  id: checklistItemEdited()!.id!,
                  data: checklistItemForm.getRawValue()
                })
              : checklistItemService.add$.next({
                  item: checklistItemForm.getRawValue(),
                  checklistId: checklist()?.id!
                })
          "
          (close)="checklistItemEdited.set(null)"
        ></app-form-modal>
      </ng-template>
    </app-modal> `,
  imports: [
    ChecklistHeaderComponent,
    ModalComponent,
    FormModalComponent,
    ChecklistItemListComponent,
  ],
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  params = toSignal(this.route.paramMap);
  formBuilder = inject(FormBuilder);

  checklistItemEdited = signal<Partial<ChecklistItem> | null>(null);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === this.params()?.get('id'))
  );

  items = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((item) => item.checklistId === this.params()?.get('id'))
  );

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemEdited();
      if (!checklistItem) {
        this.checklistItemForm.reset();
      } else {
        this.checklistItemForm.patchValue({
          title: checklistItem.title,
        });
      }
    });
  }
}
