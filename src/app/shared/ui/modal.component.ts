import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
@Component({
  standalone: true,
  selector: 'app-modal',
  template: `<div></div>`,
})
export class ModalComponent {
  dialog = inject(Dialog);

  @Input() set isOpen(value: boolean) {
    if (value) {
      this.dialog.open(this.template);
    } else {
      this.dialog.closeAll();
    }
  }

  @ContentChild(TemplateRef, { static: false }) template!: TemplateRef<any>;
}
