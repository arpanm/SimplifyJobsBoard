import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ICandidate, getCandidateIdentifier } from '../candidate.model';

export type EntityResponseType = HttpResponse<ICandidate>;
export type EntityArrayResponseType = HttpResponse<ICandidate[]>;

@Injectable({ providedIn: 'root' })
export class CandidateService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/candidates');
  public resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/candidates');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(candidate: ICandidate): Observable<EntityResponseType> {
    return this.http.post<ICandidate>(this.resourceUrl, candidate, { observe: 'response' });
  }

  update(candidate: ICandidate): Observable<EntityResponseType> {
    return this.http.put<ICandidate>(`${this.resourceUrl}/${getCandidateIdentifier(candidate) as number}`, candidate, {
      observe: 'response',
    });
  }

  partialUpdate(candidate: ICandidate): Observable<EntityResponseType> {
    return this.http.patch<ICandidate>(`${this.resourceUrl}/${getCandidateIdentifier(candidate) as number}`, candidate, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICandidate>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICandidate[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICandidate[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addCandidateToCollectionIfMissing(
    candidateCollection: ICandidate[],
    ...candidatesToCheck: (ICandidate | null | undefined)[]
  ): ICandidate[] {
    const candidates: ICandidate[] = candidatesToCheck.filter(isPresent);
    if (candidates.length > 0) {
      const candidateCollectionIdentifiers = candidateCollection.map(candidateItem => getCandidateIdentifier(candidateItem)!);
      const candidatesToAdd = candidates.filter(candidateItem => {
        const candidateIdentifier = getCandidateIdentifier(candidateItem);
        if (candidateIdentifier == null || candidateCollectionIdentifiers.includes(candidateIdentifier)) {
          return false;
        }
        candidateCollectionIdentifiers.push(candidateIdentifier);
        return true;
      });
      return [...candidatesToAdd, ...candidateCollection];
    }
    return candidateCollection;
  }
}
