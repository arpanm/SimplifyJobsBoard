import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'job',
        data: { pageTitle: 'simplifyJobsBoardApp.job.home.title' },
        loadChildren: () => import('./job/job.module').then(m => m.JobModule),
      },
      {
        path: 'candidate',
        data: { pageTitle: 'simplifyJobsBoardApp.candidate.home.title' },
        loadChildren: () => import('./candidate/candidate.module').then(m => m.CandidateModule),
      },
      {
        path: 'application',
        data: { pageTitle: 'simplifyJobsBoardApp.application.home.title' },
        loadChildren: () => import('./application/application.module').then(m => m.ApplicationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
