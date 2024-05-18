import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormBuilder } from '@angular/forms';
import { FormModalComponent } from '../shared/ui/form-modal.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `<header>
      <h1>Quicklists</h1>
      <button (click)="checklistEdited.set({})">Add Checklist</button>
    </header>
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
        ></app-form-modal>
      </ng-template>
    </app-modal>`,
  imports: [ModalComponent, FormModalComponent],
})
export default class HomeComponent {
  formBuilder = inject(FormBuilder);
  checklistEdited = signal<Partial<Checklist> | null>(null);
  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      if (!this.checklistEdited()) this.checklistForm.reset();
    });
  }
}

/**
 * Partial - utility type that allows any | none of the properties for Checklist to be specified
 * Don't use a true | false signal for isOpen property, that will be imperative
 * Instead just use (NOT NOT)!!value
 * **/
