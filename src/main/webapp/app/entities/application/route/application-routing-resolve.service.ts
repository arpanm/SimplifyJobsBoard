import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IApplication, Application } from '../application.model';
import { ApplicationService } from '../service/application.service';

@Injectable({ providedIn: 'root' })
export class ApplicationRoutingResolveService implements Resolve<IApplication> {
  constructor(protected service: ApplicationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApplication> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((application: HttpResponse<Application>) => {
          if (application.body) {
            return of(application.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Application());
  }
}
