import { Injectable } from '@angular/core';
import { IAlert, IAlertPayload } from '../../models/alerts.interface';
import { AlertType } from '../../enums/alerts.enum';
import { Observable } from 'rxjs/internal/Observable';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private subject = new Subject<any>();
  private persistent = true;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      this.persistent = event instanceof NavigationStart;
    });
  }

  getAlert(id: string): Observable<any> {
    return this.subject.asObservable().pipe(filter((alert: IAlert) => alert && alert.id === id));
  }

  alertInfo(payload: IAlertPayload, ttl: number = Infinity, redirectUrl: string = null) {
    this.sendAlert(new IAlert({ type: AlertType.Info, payload, ttl, redirectUrl }));
  }

  alertWarning(payload: IAlertPayload, ttl: number = Infinity, redirectUrl: string = null) {
    this.sendAlert(new IAlert({ type: AlertType.Warning, payload, ttl, redirectUrl }));
  }

  alertDanger(payload: IAlertPayload, ttl: number = Infinity, redirectUrl: string = null) {
    this.sendAlert(new IAlert({ type: AlertType.Danger, payload, ttl, redirectUrl }));
  }

  alertSuccess(payload: IAlertPayload, ttl: number = Infinity, redirectUrl: string = null) {
    this.sendAlert(new IAlert({ type: AlertType.Success, payload, ttl, redirectUrl }));
  }

  sendAlert(alert: IAlert) {
    this.persistent = true;
    this.subject.next(alert);
  }

  clearAlerts(id?: string) {
    this.subject.next(new IAlert({id}));
  }

}
