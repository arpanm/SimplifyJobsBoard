import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IJob, Job } from '../job.model';
import { JobService } from '../service/job.service';

@Component({
  selector: 'jhi-job-update',
  templateUrl: './job-update.component.html',
})
export class JobUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    role: [],
    yearsOfExperience: [],
    minSalary: [],
    maxSalary: [],
    degree: [],
    locationType: [],
    jobType: [],
    city: [],
    description: [],
    creatorEmail: [null, [Validators.required]],
    creatorMobile: [null, [Validators.required]],
    createdTime: [],
  });

  constructor(protected jobService: JobService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.updateForm(job);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const job = this.createFromForm();
    if (job.id !== undefined) {
      this.subscribeToSaveResponse(this.jobService.update(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.create(job));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJob>>): void {
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

  protected updateForm(job: IJob): void {
    this.editForm.patchValue({
      id: job.id,
      title: job.title,
      role: job.role,
      yearsOfExperience: job.yearsOfExperience,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      degree: job.degree,
      locationType: job.locationType,
      jobType: job.jobType,
      city: job.city,
      description: job.description,
      creatorEmail: job.creatorEmail,
      creatorMobile: job.creatorMobile,
      createdTime: job.createdTime,
    });
  }

  protected createFromForm(): IJob {
    return {
      ...new Job(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      role: this.editForm.get(['role'])!.value,
      yearsOfExperience: this.editForm.get(['yearsOfExperience'])!.value,
      minSalary: this.editForm.get(['minSalary'])!.value,
      maxSalary: this.editForm.get(['maxSalary'])!.value,
      degree: this.editForm.get(['degree'])!.value,
      locationType: this.editForm.get(['locationType'])!.value,
      jobType: this.editForm.get(['jobType'])!.value,
      city: this.editForm.get(['city'])!.value,
      description: this.editForm.get(['description'])!.value,
      creatorEmail: this.editForm.get(['creatorEmail'])!.value,
      creatorMobile: this.editForm.get(['creatorMobile'])!.value,
      createdTime: this.editForm.get(['createdTime'])!.value,
    };
  }
}
