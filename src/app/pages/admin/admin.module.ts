import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminUserManagementService} from "./user-management.service";
import {AdminComponent} from "./admin.component";
import {RoleGuard} from "../../@core/services/auth.guard";
import {RouterModule} from "@angular/router";
import { RegistrationRequestsComponent } from './registration-requests/registration-requests.component';
import {AdminRouting} from "./admin-routing.module";
import {ThemeModule} from "../../@theme/theme.module";
import {SmartTableService} from "../../@core/data/smart-table.service";
import {Ng2SmartTableModule} from "ng2-smart-table";
import { JerseyComponent } from './jersey/jersey.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    AdminRouting,
    RouterModule,
    Ng2SmartTableModule
  ],
  declarations: [
    AdminComponent,
    RegistrationRequestsComponent,
    JerseyComponent
  ],
  providers: [
    AdminUserManagementService,
    SmartTableService
  ]
})
export class AdminModule { }
