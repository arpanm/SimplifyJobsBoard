jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CandidateService } from '../service/candidate.service';
import { ICandidate, Candidate } from '../candidate.model';

import { CandidateUpdateComponent } from './candidate-update.component';

describe('Component Tests', () => {
  describe('Candidate Management Update Component', () => {
    let comp: CandidateUpdateComponent;
    let fixture: ComponentFixture<CandidateUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let candidateService: CandidateService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CandidateUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CandidateUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CandidateUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      candidateService = TestBed.inject(CandidateService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const candidate: ICandidate = { id: 456 };

        activatedRoute.data = of({ candidate });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(candidate));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const candidate = { id: 123 };
        spyOn(candidateService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ candidate });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: candidate }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(candidateService.update).toHaveBeenCalledWith(candidate);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const candidate = new Candidate();
        spyOn(candidateService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ candidate });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: candidate }));
        saveSubject.complete();

        // THEN
        expect(candidateService.create).toHaveBeenCalledWith(candidate);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const candidate = { id: 123 };
        spyOn(candidateService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ candidate });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(candidateService.update).toHaveBeenCalledWith(candidate);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
