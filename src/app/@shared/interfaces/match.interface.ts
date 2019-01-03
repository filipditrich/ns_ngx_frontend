import { IPlace } from './place.interface';
import { ITeam } from './team.interface';
import { IUser } from './user.interface';
import { IGroup } from './group.interface';
import { IJersey } from './jersey.interface';
import { TimestampInterface } from './timestamp.interface';

export interface IMatch extends TimestampInterface {
  _id: string;
  title: string;
  date: Date;
  place: IPlace;
  group: IGroup;
  note?: string;
  enrollment: {
    enrollmentOpens: Date,
    enrollmentCloses: Date,
    maxCapacity: Number,
    players: IEnrollmentPlayer[],
  };
  reminder: {
    reminderDate: Date;
    remind: boolean;
    hasBeenReminded: boolean;
    reminderTeams: ITeam[];
  };
  results?: IMatchResult;
  cancelled?: boolean;
  cancelledBy?: string;
  cancelledByUser?: string;
}

export interface IMatchResult extends TimestampInterface {
  _id?: string;
  match?: string;
  players: IMatchResultPlayers[];
}

export interface IMatchResultPlayers {
  goals?: Number;
  _id?: string;
  player: IUser;
  jersey: IJersey;
  status: MatchResult;
}

export interface IEnrollmentPlayer {
  player: string;
  enrolledOn: Date;
  status: EnrollmentStatus;
  info?: IUser;
}

export enum EnrollmentStatus {
  Going = 'going',
  Skipping = 'skipping',
}

export enum MatchResult {
  Win = 'win',
  Loose = 'loose',
  Draft = 'draft',
}
