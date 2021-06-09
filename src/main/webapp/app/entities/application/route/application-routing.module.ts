import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ApplicationComponent } from '../list/application.component';
import { ApplicationDetailComponent } from '../detail/application-detail.component';
import { ApplicationUpdateComponent } from '../update/application-update.component';
import { ApplicationRoutingResolveService } from './application-routing-resolve.service';

const applicationRoute: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApplicationDetailComponent,
    resolve: {
      application: ApplicationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ApplicationUpdateComponent,
    resolve: {
      application: ApplicationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ApplicationUpdateComponent,
    resolve: {
      application: ApplicationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(applicationRoute)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
