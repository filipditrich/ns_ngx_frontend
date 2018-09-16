import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminUserManagementService} from "./user-management.service";
import {AdminComponent} from "./admin.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AdminComponent
  ],
  providers: [
    AdminUserManagementService
  ]
})
export class AdminModule { }
