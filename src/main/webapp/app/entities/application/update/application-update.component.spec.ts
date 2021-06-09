jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ApplicationService } from '../service/application.service';
import { IApplication, Application } from '../application.model';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';

import { ApplicationUpdateComponent } from './application-update.component';

describe('Component Tests', () => {
  describe('Application Management Update Component', () => {
    let comp: ApplicationUpdateComponent;
    let fixture: ComponentFixture<ApplicationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let applicationService: ApplicationService;
    let jobService: JobService;
    let candidateService: CandidateService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ApplicationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ApplicationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ApplicationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      applicationService = TestBed.inject(ApplicationService);
      jobService = TestBed.inject(JobService);
      candidateService = TestBed.inject(CandidateService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Job query and add missing value', () => {
        const application: IApplication = { id: 456 };
        const job: IJob = { id: 38525 };
        application.job = job;

        const jobCollection: IJob[] = [{ id: 60450 }];
        spyOn(jobService, 'query').and.returnValue(of(new HttpResponse({ body: jobCollection })));
        const additionalJobs = [job];
        const expectedCollection: IJob[] = [...additionalJobs, ...jobCollection];
        spyOn(jobService, 'addJobToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ application });
        comp.ngOnInit();

        expect(jobService.query).toHaveBeenCalled();
        expect(jobService.addJobToCollectionIfMissing).toHaveBeenCalledWith(jobCollection, ...additionalJobs);
        expect(comp.jobsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Candidate query and add missing value', () => {
        const application: IApplication = { id: 456 };
        const candidate: ICandidate = { id: 69295 };
        application.candidate = candidate;

        const candidateCollection: ICandidate[] = [{ id: 25091 }];
        spyOn(candidateService, 'query').and.returnValue(of(new HttpResponse({ body: candidateCollection })));
        const additionalCandidates = [candidate];
        const expectedCollection: ICandidate[] = [...additionalCandidates, ...candidateCollection];
        spyOn(candidateService, 'addCandidateToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ application });
        comp.ngOnInit();

        expect(candidateService.query).toHaveBeenCalled();
        expect(candidateService.addCandidateToCollectionIfMissing).toHaveBeenCalledWith(candidateCollection, ...additionalCandidates);
        expect(comp.candidatesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const application: IApplication = { id: 456 };
        const job: IJob = { id: 75953 };
        application.job = job;
        const candidate: ICandidate = { id: 46476 };
        application.candidate = candidate;

        activatedRoute.data = of({ application });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(application));
        expect(comp.jobsSharedCollection).toContain(job);
        expect(comp.candidatesSharedCollection).toContain(candidate);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const application = { id: 123 };
        spyOn(applicationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ application });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: application }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(applicationService.update).toHaveBeenCalledWith(application);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const application = new Application();
        spyOn(applicationService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ application });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: application }));
        saveSubject.complete();

        // THEN
        expect(applicationService.create).toHaveBeenCalledWith(application);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const application = { id: 123 };
        spyOn(applicationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ application });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(applicationService.update).toHaveBeenCalledWith(application);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackJobById', () => {
        it('Should return tracked Job primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackJobById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCandidateById', () => {
        it('Should return tracked Candidate primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCandidateById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
