import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICandidate } from '../candidate.model';

@Component({
  selector: 'jhi-candidate-detail',
  templateUrl: './candidate-detail.component.html',
})
export class CandidateDetailComponent implements OnInit {
  candidate: ICandidate | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ candidate }) => {
      this.candidate = candidate;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
