import { Component, Input, OnInit } from '@angular/core';
import { IDialog } from '../../models/dialogs.interface';
import { DialogsService } from './dialogs.service';
import { DialogType } from '../../enums/dialogs.enum';

@Component({
  selector: 'ns-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent implements OnInit {

  @Input() id: string;
  dialogs: IDialog[] = [];

  constructor(private dialogService: DialogsService) { }

  ngOnInit() {
    this.dialogService.getDialog(this.id).subscribe((dialog: IDialog) => {
      if (!dialog.payload) { this.dialogs = []; return; }
      this.dialogs.push(dialog);
    });
  }

  removeDialog(dialog: IDialog) {
    this.dialogs = this.dialogs.filter(x => x !== dialog);
  }

  dialogClass(dialog: IDialog) {
    if (!dialog) { return; }

    switch (dialog.type) {
      case DialogType.Danger:
        return 'modal-dialog modal-danger';
      case DialogType.Info:
        return 'modal-dialog';
    }
  }

}
