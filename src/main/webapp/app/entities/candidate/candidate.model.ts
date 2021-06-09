import { IApplication } from 'app/entities/application/application.model';
import { Degree } from 'app/entities/enumerations/degree.model';
import { City } from 'app/entities/enumerations/city.model';

export interface ICandidate {
  id?: number;
  email?: string;
  mobile?: string;
  degree?: Degree | null;
  description?: string | null;
  city?: City | null;
  currentSalary?: number | null;
  applications?: IApplication[] | null;
}

export class Candidate implements ICandidate {
  constructor(
    public id?: number,
    public email?: string,
    public mobile?: string,
    public degree?: Degree | null,
    public description?: string | null,
    public city?: City | null,
    public currentSalary?: number | null,
    public applications?: IApplication[] | null
  ) {}
}

export function getCandidateIdentifier(candidate: ICandidate): number | undefined {
  return candidate.id;
}
