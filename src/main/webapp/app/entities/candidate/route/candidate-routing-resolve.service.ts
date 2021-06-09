import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICandidate, Candidate } from '../candidate.model';
import { CandidateService } from '../service/candidate.service';

@Injectable({ providedIn: 'root' })
export class CandidateRoutingResolveService implements Resolve<ICandidate> {
  constructor(protected service: CandidateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICandidate> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((candidate: HttpResponse<Candidate>) => {
          if (candidate.body) {
            return of(candidate.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Candidate());
  }
}
