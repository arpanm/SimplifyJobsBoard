jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IApplication, Application } from '../application.model';
import { ApplicationService } from '../service/application.service';

import { ApplicationRoutingResolveService } from './application-routing-resolve.service';

describe('Service Tests', () => {
  describe('Application routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ApplicationRoutingResolveService;
    let service: ApplicationService;
    let resultApplication: IApplication | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ApplicationRoutingResolveService);
      service = TestBed.inject(ApplicationService);
      resultApplication = undefined;
    });

    describe('resolve', () => {
      it('should return IApplication returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultApplication = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultApplication).toEqual({ id: 123 });
      });

      it('should return new IApplication if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultApplication = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultApplication).toEqual(new Application());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultApplication = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultApplication).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
