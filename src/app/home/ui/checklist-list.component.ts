import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Checklist,
  EditChecklist,
  DeleteChecklist,
} from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-checklist-list',
  template: `
    <ul>
      @for (checklist of checklists; track checklist.id) {
      <li>
        <a routerLink="/checklist/{{ checklist.id }}">{{ checklist.title }}</a>
        <button (click)="edit.emit(checklist)">Edit</button>
        <button (click)="delete.emit(checklist.id)">Delete</button>
      </li>
      }@empty {
      <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
  imports: [RouterLink],
})
export class ChecklistListComponent {
  @Input({ required: true }) checklists!: Checklist[];
  @Output() delete = new EventEmitter<DeleteChecklist>();
  @Output() edit = new EventEmitter<Checklist>();
}
