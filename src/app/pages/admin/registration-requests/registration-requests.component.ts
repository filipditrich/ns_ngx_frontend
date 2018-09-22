import { Component, OnInit } from '@angular/core';
import {LocalDataSource} from "ng2-smart-table";
import {SmartTableService} from "../../../@core/data/smart-table.service";
import {RequestsService} from "../requests.service";
import {ErrorHelper} from "../../../@core/helpers/error.helper";

@Component({
  selector: 'ngx-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: ['./registration-requests.component.scss']
})
export class RegistrationRequestsComponent implements OnInit {

  public openForm: boolean = false;

  constructor(
    private service: SmartTableService,
    private requestsService: RequestsService,
    private errorHelper: ErrorHelper
  ) {
    // const data = this.service.getData();
    // this.source.load(data);

    this.requestsService.getAllRequests().subscribe(requests => {
      const data = requests["response"];
      const requestsArray = [];

      for (var i = 0; i < data.length; i++) {
        if(!data[i]["approval"]["approved"]){
          requestsArray.push(data[i]);
        }
      }

      setTimeout(() => {
        console.log(requestsArray);
        this.source.load(requestsArray);
        }, 3000);
    }, err => {
      this.errorHelper.handleGenericError(err);
    });
  }

  ngOnInit() {
  }

  settings = {
    noDataMessage: "Nebyla přidána žádná nová žádost o schválení",
    pager: true,
    actions: {
      delete: false,
      edit: false,
      custom: [
        {
          name: 'confirm',
          title: '<i class="nb-checkmark"></i>',
        }
      ],

    },
    columns: {
      name: {
        title: 'Jméno',
        type: 'string',
        editable: false,
      },
      email: {
        title: 'E-mail',
        type: 'string',
        editable: false,
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  onCustom(event) {
    if (event.action === 'confirm') {
      console.log(event);
      this.requestsService.requestAprroval({state: true, id: event.data._id}).subscribe(response => {
        console.log(response)
        window.location.reload();
      }, err => {
        console.log(err);
      });
    } else {
      this.errorHelper.handleGenericError(401);
    }
  }


}
