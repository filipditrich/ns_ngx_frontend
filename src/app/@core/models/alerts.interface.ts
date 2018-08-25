import { AlertType } from '../enums/alerts.enum';

export class IAlert {
  id: string;
  type: AlertType;
  payload: IAlertPayload;
  persistent: boolean;
  ttl: number;
  redirectUrl: string;

  constructor(init?: Partial<IAlert>) {
    Object.assign(this, init);
  }

}

export interface IAlertPayload {
  title?: string;
  body: string;
}
