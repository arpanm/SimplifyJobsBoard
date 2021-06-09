import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CandidateComponent } from './list/candidate.component';
import { CandidateDetailComponent } from './detail/candidate-detail.component';
import { CandidateUpdateComponent } from './update/candidate-update.component';
import { CandidateDeleteDialogComponent } from './delete/candidate-delete-dialog.component';
import { CandidateRoutingModule } from './route/candidate-routing.module';

@NgModule({
  imports: [SharedModule, CandidateRoutingModule],
  declarations: [CandidateComponent, CandidateDetailComponent, CandidateUpdateComponent, CandidateDeleteDialogComponent],
  entryComponents: [CandidateDeleteDialogComponent],
})
export class CandidateModule {}
