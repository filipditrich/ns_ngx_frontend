import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import {RegistrationRequestsComponent} from "./registration-requests/registration-requests.component";
import {JerseyComponent} from "./jersey/jersey.component";


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
      path: 'registration-requests',
      component: RegistrationRequestsComponent
  },
  {
    path: 'jersey',
    component: JerseyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRouting { }
