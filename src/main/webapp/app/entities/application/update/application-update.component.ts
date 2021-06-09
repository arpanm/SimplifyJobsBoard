import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IApplication, Application } from '../application.model';
import { ApplicationService } from '../service/application.service';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';

@Component({
  selector: 'jhi-application-update',
  templateUrl: './application-update.component.html',
})
export class ApplicationUpdateComponent implements OnInit {
  isSaving = false;

  jobsSharedCollection: IJob[] = [];
  candidatesSharedCollection: ICandidate[] = [];

  editForm = this.fb.group({
    id: [],
    applicationTime: [],
    desiredSalary: [],
    yearsOfExpericeOnThisRole: [],
    job: [],
    candidate: [],
  });

  constructor(
    protected applicationService: ApplicationService,
    protected jobService: JobService,
    protected candidateService: CandidateService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ application }) => {
      this.updateForm(application);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const application = this.createFromForm();
    if (application.id !== undefined) {
      this.subscribeToSaveResponse(this.applicationService.update(application));
    } else {
      this.subscribeToSaveResponse(this.applicationService.create(application));
    }
  }

  trackJobById(index: number, item: IJob): number {
    return item.id!;
  }

  trackCandidateById(index: number, item: ICandidate): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplication>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(application: IApplication): void {
    this.editForm.patchValue({
      id: application.id,
      applicationTime: application.applicationTime,
      desiredSalary: application.desiredSalary,
      yearsOfExpericeOnThisRole: application.yearsOfExpericeOnThisRole,
      job: application.job,
      candidate: application.candidate,
    });

    this.jobsSharedCollection = this.jobService.addJobToCollectionIfMissing(this.jobsSharedCollection, application.job);
    this.candidatesSharedCollection = this.candidateService.addCandidateToCollectionIfMissing(
      this.candidatesSharedCollection,
      application.candidate
    );
  }

  protected loadRelationshipsOptions(): void {
    this.jobService
      .query()
      .pipe(map((res: HttpResponse<IJob[]>) => res.body ?? []))
      .pipe(map((jobs: IJob[]) => this.jobService.addJobToCollectionIfMissing(jobs, this.editForm.get('job')!.value)))
      .subscribe((jobs: IJob[]) => (this.jobsSharedCollection = jobs));

    this.candidateService
      .query()
      .pipe(map((res: HttpResponse<ICandidate[]>) => res.body ?? []))
      .pipe(
        map((candidates: ICandidate[]) =>
          this.candidateService.addCandidateToCollectionIfMissing(candidates, this.editForm.get('candidate')!.value)
        )
      )
      .subscribe((candidates: ICandidate[]) => (this.candidatesSharedCollection = candidates));
  }

  protected createFromForm(): IApplication {
    return {
      ...new Application(),
      id: this.editForm.get(['id'])!.value,
      applicationTime: this.editForm.get(['applicationTime'])!.value,
      desiredSalary: this.editForm.get(['desiredSalary'])!.value,
      yearsOfExpericeOnThisRole: this.editForm.get(['yearsOfExpericeOnThisRole'])!.value,
      job: this.editForm.get(['job'])!.value,
      candidate: this.editForm.get(['candidate'])!.value,
    };
  }
}
