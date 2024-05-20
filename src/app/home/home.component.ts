import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormBuilder } from '@angular/forms';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistListComponent } from './ui/checklist-list.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `<header>
      <p>Quicklists</p>
      <button (click)="checklistEdited.set({})">Add Checklist</button>
    </header>
    <section>
      <p>Your Checklists</p>
      <app-checklist-list
        [checklists]="checklistService.checklists()"
        (delete)="checklistService.delete$.next($event)"
        (edit)="checklistEdited.set($event)"
      ></app-checklist-list>
    </section>
    <app-modal [isOpen]="!!checklistEdited()">
      <ng-template>
        <app-form-modal
          [title]="
            checklistEdited()?.title
              ? checklistEdited()!.title!
              : 'Add Checklist'
          "
          [formGroup]="checklistForm"
          (close)="checklistEdited.set(null)"
          (save)="
            checklistEdited()?.id
              ? checklistService.edit$.next({
                  id: checklistEdited()!.id!,
                  data: checklistForm.getRawValue()
                })
              : checklistService.add$.next(checklistForm.getRawValue())
          "
        ></app-form-modal>
      </ng-template>
    </app-modal>`,
  imports: [ModalComponent, FormModalComponent, ChecklistListComponent],
})
export default class HomeComponent {
  formBuilder = inject(FormBuilder);
  checklistService = inject(ChecklistService);

  checklistEdited = signal<Partial<Checklist> | null>(null);
  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklist = this.checklistEdited();
      if (!checklist) {
        this.checklistForm.reset();
      } else {
        this.checklistForm.patchValue({ title: checklist.title });
      }
    });
  }
}

/**
 * Partial - utility type that allows any | none of the properties for Checklist to be specified
 * Don't use a true | false signal for isOpen property, that will be imperative
 * Instead just use (NOT NOT)!!value
 * **/
