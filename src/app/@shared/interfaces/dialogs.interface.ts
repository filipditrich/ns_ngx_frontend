import { DialogType } from '../enums/dialogs.enum';

export class IDialog {
  id: string;
  type: DialogType;
  payload: IDialogPayload;

  constructor(init?: Partial<IDialog>) {
    Object.assign(this, init);
  }

}

export interface IDialogPayload {
  title: string;
  body: string;
  buttons?: IDialogPayloadButtons | IDialogPayloadButtons[];
}

export interface IDialogPayloadButtons {
  class: string;
  text: string;
  action: any;
}
