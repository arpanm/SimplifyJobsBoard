import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ApplicationDetailComponent } from './application-detail.component';

describe('Component Tests', () => {
  describe('Application Management Detail Component', () => {
    let comp: ApplicationDetailComponent;
    let fixture: ComponentFixture<ApplicationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ApplicationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ application: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ApplicationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ApplicationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load application on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.application).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
