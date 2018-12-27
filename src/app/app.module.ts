import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { AppComponent } from './app.component';
import { AppRouting } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PagesModule } from './pages';
import { HttpHeadersInterceptor } from './@core/services/http.interceptor';
import { PreloadInitializer } from './@core/services/preload.initializer';
import { GlobalErrorHandler } from './@core/services/error-handler.provider';
import { AuthModule } from './auth';
import { ToasterModule } from 'angular2-toaster';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SortablejsModule } from 'angular-sortablejs';
import { ModalComponent } from './pages/ui-features/modals/modal/modal.component';
import { Ng2SmartTableExtendedModule } from 'ng2-smart-table-extended';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlaceRendererComponent } from './@core/tables/renderers/place.renderer';
import { EOpenRendererComponent } from './@core/tables/renderers/eopen.renderer';
import { ECloseRendererComponent } from './@core/tables/renderers/eclose.renderer';
import { UsersEditorComponent } from './@core/tables/editors/users.editor';
import { DatetimeEditorComponent } from './@core/tables/editors/datetime.editor';
import { EPlayersStatusEditorComponent } from './@core/tables/editors/eplayers-status.editor';
import { EPlayersRendererComponent } from './@core/tables/renderers/eplayers.renderer';
import { NbSpinnerModule } from '@nebular/theme';
import { TablePreferencesComponent } from './@core/tables/table-preferences/table-preferences.component';
import { SharedModule } from './@shared/shared.module';

export function PreloadInitializerProviderFactory(provider: PreloadInitializer) {
  return () => provider.startupConfig();
}

const EDITORS = [ UsersEditorComponent, DatetimeEditorComponent, EPlayersStatusEditorComponent ];
const RENDERS = [ PlaceRendererComponent, EOpenRendererComponent, ECloseRendererComponent, EPlayersRendererComponent ];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRouting,
    PagesModule,
    HttpClientModule,
    AuthModule,
    ToasterModule.forRoot(),
    NgbModalModule,
    NgbModule,
    NgxMyDatePickerModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SortablejsModule.forRoot({ animation: 150 }),
    Ng2SmartTableExtendedModule,
    NgSelectModule,
    NbSpinnerModule,
  ],
  declarations: [
    ...EDITORS,
    ...RENDERS,
    AppComponent,
    ModalComponent,
    TablePreferencesComponent,
  ],
  entryComponents: [
    ...EDITORS,
    ...RENDERS,
    ModalComponent,
    TablePreferencesComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true },
    { provide: APP_INITIALIZER,
      useFactory: PreloadInitializerProviderFactory,
      deps: [PreloadInitializer],
      multi: true },
    { provide: ErrorHandler,
      useClass: GlobalErrorHandler },
  ],
})
export class AppModule {
}
