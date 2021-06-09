import * as dayjs from 'dayjs';
import { IApplication } from 'app/entities/application/application.model';
import { Degree } from 'app/entities/enumerations/degree.model';
import { LocationType } from 'app/entities/enumerations/location-type.model';
import { JobType } from 'app/entities/enumerations/job-type.model';
import { City } from 'app/entities/enumerations/city.model';

export interface IJob {
  id?: number;
  title?: string;
  role?: string | null;
  yearsOfExperience?: number | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  degree?: Degree | null;
  locationType?: LocationType | null;
  jobType?: JobType | null;
  city?: City | null;
  description?: string | null;
  creatorEmail?: string;
  creatorMobile?: string;
  createdTime?: dayjs.Dayjs | null;
  applications?: IApplication[] | null;
}

export class Job implements IJob {
  constructor(
    public id?: number,
    public title?: string,
    public role?: string | null,
    public yearsOfExperience?: number | null,
    public minSalary?: number | null,
    public maxSalary?: number | null,
    public degree?: Degree | null,
    public locationType?: LocationType | null,
    public jobType?: JobType | null,
    public city?: City | null,
    public description?: string | null,
    public creatorEmail?: string,
    public creatorMobile?: string,
    public createdTime?: dayjs.Dayjs | null,
    public applications?: IApplication[] | null
  ) {}
}

export function getJobIdentifier(job: IJob): number | undefined {
  return job.id;
}
