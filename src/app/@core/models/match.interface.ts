import { MatchResult } from '../enums/result.enum';

export interface IMatch {

  title: string;
  date: string;
  place?: string;
  note?: string;
  afterMatch?: {
    teams: IMatchTeam;
    winner: string;
  };
  cancelled: boolean;
  cancelledBy: string;
  cancelledByUser: string;
  createdBy: string;

}

export interface IMatchTeam {
  team: string;
  players: string[];
  goals: {
    scorers: string[];
    total: number;
  };
  result: MatchResult;
}
