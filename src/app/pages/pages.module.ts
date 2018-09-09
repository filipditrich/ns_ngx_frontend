import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AlertsService } from "../@core/services/alerts/alerts.service";
import { DialogsService } from "../@core/services/dialogs/dialogs.service";
import { PreviousRouteService } from "../@core/services/previous-route.service";
import { PreventLogged } from "../@core/services/auth.guard";
import { AuthGuard } from "../@core/services/auth.guard";
import { RoleGuard } from "../@core/services/auth.guard";
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import {ToasterModule} from "angular2-toaster";
import {LoginComponent} from "./auth/login/login.component";
import {AlertsComponent} from "../@core/services/alerts/alerts.component";
import {DialogsComponent} from "../@core/services/dialogs/dialogs.component";
import {NotFoundComponent} from "./miscellaneous/not-found/not-found.component";
import {LogoutComponent} from "./auth/logout/logout.component";
import { MatchesComponent } from './matches/matches.component';
import {Ng2SmartTableModule} from "ng2-smart-table";
import { MatchesResultsComponent } from './matches/matches-results/matches-results.component';
import { RoleCheckService } from "../@core/services/roleCheck.service";
import { MomentModule } from "angular2-moment";
import { JerseysService } from "../@core/services/jerseys.service";

const PAGES_COMPONENTS = [
  LoginComponent, AlertsComponent, DialogsComponent, LogoutComponent, PagesComponent
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    ToasterModule.forRoot(),
    Ng2SmartTableModule,
    MomentModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    MatchesComponent,
    MatchesResultsComponent,
  ],
  providers: [
    AlertsService,
    DialogsService,
    PreviousRouteService,
    RoleCheckService,
    JerseysService,

    [PreventLogged],
    [AuthGuard],
    [RoleGuard]
  ]
})
export class PagesModule {
}
