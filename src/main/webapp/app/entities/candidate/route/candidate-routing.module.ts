import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CandidateComponent } from '../list/candidate.component';
import { CandidateDetailComponent } from '../detail/candidate-detail.component';
import { CandidateUpdateComponent } from '../update/candidate-update.component';
import { CandidateRoutingResolveService } from './candidate-routing-resolve.service';

const candidateRoute: Routes = [
  {
    path: '',
    component: CandidateComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CandidateDetailComponent,
    resolve: {
      candidate: CandidateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CandidateUpdateComponent,
    resolve: {
      candidate: CandidateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CandidateUpdateComponent,
    resolve: {
      candidate: CandidateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(candidateRoute)],
  exports: [RouterModule],
})
export class CandidateRoutingModule {}
