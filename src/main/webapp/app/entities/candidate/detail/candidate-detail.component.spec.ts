import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CandidateDetailComponent } from './candidate-detail.component';

describe('Component Tests', () => {
  describe('Candidate Management Detail Component', () => {
    let comp: CandidateDetailComponent;
    let fixture: ComponentFixture<CandidateDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CandidateDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ candidate: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CandidateDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CandidateDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load candidate on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.candidate).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
