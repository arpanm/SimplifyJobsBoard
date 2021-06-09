jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICandidate, Candidate } from '../candidate.model';
import { CandidateService } from '../service/candidate.service';

import { CandidateRoutingResolveService } from './candidate-routing-resolve.service';

describe('Service Tests', () => {
  describe('Candidate routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CandidateRoutingResolveService;
    let service: CandidateService;
    let resultCandidate: ICandidate | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CandidateRoutingResolveService);
      service = TestBed.inject(CandidateService);
      resultCandidate = undefined;
    });

    describe('resolve', () => {
      it('should return ICandidate returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCandidate = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCandidate).toEqual({ id: 123 });
      });

      it('should return new ICandidate if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCandidate = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCandidate).toEqual(new Candidate());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCandidate = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCandidate).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
