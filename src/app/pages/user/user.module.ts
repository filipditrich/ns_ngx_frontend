import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserRoutingModule} from "./user-routing.module";
import {UserComponent} from "./user.component";
import { ProfileComponent } from './profile/profile.component';
import {ThemeModule} from "../../@theme/theme.module";

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    UserRoutingModule
  ],
  declarations: [
    UserComponent,
    ProfileComponent
  ]
})
export class UserModule { }
