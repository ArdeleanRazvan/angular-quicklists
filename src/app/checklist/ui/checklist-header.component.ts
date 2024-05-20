import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../shared/interfaces/checklist';
import { ResetChecklist } from '../../shared/interfaces/checklist-item';

@Component({
  standalone: true,
  selector: 'app-checklist-header',
  template: `<header>
    <a routerLink="/home">Back</a>
    <p>{{ checklist.title }}</p>
    <div>
      <button (click)="resetChecklist.emit(checklist.id)">Reset</button>
      <button (click)="addItem.emit()">Add Item</button>
    </div>
  </header>`,
  imports: [RouterLink],
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;
  @Output() addItem = new EventEmitter<void>();
  @Output() resetChecklist = new EventEmitter<ResetChecklist>();
}
