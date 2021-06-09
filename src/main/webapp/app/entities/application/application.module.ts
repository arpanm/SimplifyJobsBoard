import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ApplicationComponent } from './list/application.component';
import { ApplicationDetailComponent } from './detail/application-detail.component';
import { ApplicationUpdateComponent } from './update/application-update.component';
import { ApplicationDeleteDialogComponent } from './delete/application-delete-dialog.component';
import { ApplicationRoutingModule } from './route/application-routing.module';

@NgModule({
  imports: [SharedModule, ApplicationRoutingModule],
  declarations: [ApplicationComponent, ApplicationDetailComponent, ApplicationUpdateComponent, ApplicationDeleteDialogComponent],
  entryComponents: [ApplicationDeleteDialogComponent],
})
export class ApplicationModule {}
