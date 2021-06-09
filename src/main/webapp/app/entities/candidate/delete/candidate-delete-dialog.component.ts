import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICandidate } from '../candidate.model';
import { CandidateService } from '../service/candidate.service';

@Component({
  templateUrl: './candidate-delete-dialog.component.html',
})
export class CandidateDeleteDialogComponent {
  candidate?: ICandidate;

  constructor(protected candidateService: CandidateService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.candidateService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
