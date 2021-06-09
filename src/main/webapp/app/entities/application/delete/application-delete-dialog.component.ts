import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IApplication } from '../application.model';
import { ApplicationService } from '../service/application.service';

@Component({
  templateUrl: './application-delete-dialog.component.html',
})
export class ApplicationDeleteDialogComponent {
  application?: IApplication;

  constructor(protected applicationService: ApplicationService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.applicationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
