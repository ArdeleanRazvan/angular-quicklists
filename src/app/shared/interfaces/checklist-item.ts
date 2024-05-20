export interface ChecklistItem {
  id: string;
  checklistId: string;
  title: string;
  checked: boolean;
}

export type AddChecklistItem = {
  item: Omit<ChecklistItem, 'id' | 'checklistId' | 'checked'>;
  checklistId: ChecklistItem['id'];
};

export type EditChecklistItem = {
  id: ChecklistItem['id'];
  data: AddChecklistItem['item'];
};

export type DeleteChecklistItem = ChecklistItem['id'];
export type ToggleChecklistItem = DeleteChecklistItem;
export type ResetChecklist = ChecklistItem['id'];
