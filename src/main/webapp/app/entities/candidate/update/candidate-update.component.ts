import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICandidate, Candidate } from '../candidate.model';
import { CandidateService } from '../service/candidate.service';

@Component({
  selector: 'jhi-candidate-update',
  templateUrl: './candidate-update.component.html',
})
export class CandidateUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    email: [null, [Validators.required]],
    mobile: [null, [Validators.required]],
    degree: [],
    description: [],
    city: [],
    currentSalary: [],
  });

  constructor(protected candidateService: CandidateService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ candidate }) => {
      this.updateForm(candidate);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const candidate = this.createFromForm();
    if (candidate.id !== undefined) {
      this.subscribeToSaveResponse(this.candidateService.update(candidate));
    } else {
      this.subscribeToSaveResponse(this.candidateService.create(candidate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICandidate>>): void {
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

  protected updateForm(candidate: ICandidate): void {
    this.editForm.patchValue({
      id: candidate.id,
      email: candidate.email,
      mobile: candidate.mobile,
      degree: candidate.degree,
      description: candidate.description,
      city: candidate.city,
      currentSalary: candidate.currentSalary,
    });
  }

  protected createFromForm(): ICandidate {
    return {
      ...new Candidate(),
      id: this.editForm.get(['id'])!.value,
      email: this.editForm.get(['email'])!.value,
      mobile: this.editForm.get(['mobile'])!.value,
      degree: this.editForm.get(['degree'])!.value,
      description: this.editForm.get(['description'])!.value,
      city: this.editForm.get(['city'])!.value,
      currentSalary: this.editForm.get(['currentSalary'])!.value,
    };
  }
}
