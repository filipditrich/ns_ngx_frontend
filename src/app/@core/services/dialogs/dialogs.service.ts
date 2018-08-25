import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IDialog, IDialogPayload } from '../../models/dialogs.interface';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  private subject = new Subject<any>();

  constructor(private router: Router) { }

  getDialog(id: string): Observable<any> {
    return this.subject.asObservable().pipe(filter((dialog: IDialog) => dialog && dialog.id === id));
  }

  dialogInfo(payload: IDialogPayload) {
    this.sendDialog(new IDialog({ payload}));
  }

  dialogDanger(payload: IDialogPayload) {
    this.sendDialog(new IDialog({ payload }));
  }


  sendDialog(dialog: IDialog) {
    this.subject.next(dialog);
  }

  clearDialogs(id?: string) {
    this.subject.next(new IDialog({ id }));
  }

}
