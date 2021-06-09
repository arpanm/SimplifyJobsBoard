import * as dayjs from 'dayjs';
import { IJob } from 'app/entities/job/job.model';
import { ICandidate } from 'app/entities/candidate/candidate.model';

export interface IApplication {
  id?: number;
  applicationTime?: dayjs.Dayjs | null;
  desiredSalary?: number | null;
  yearsOfExpericeOnThisRole?: number | null;
  job?: IJob | null;
  candidate?: ICandidate | null;
}

export class Application implements IApplication {
  constructor(
    public id?: number,
    public applicationTime?: dayjs.Dayjs | null,
    public desiredSalary?: number | null,
    public yearsOfExpericeOnThisRole?: number | null,
    public job?: IJob | null,
    public candidate?: ICandidate | null
  ) {}
}

export function getApplicationIdentifier(application: IApplication): number | undefined {
  return application.id;
}
