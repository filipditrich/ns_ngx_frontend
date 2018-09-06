/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { CoreModule } from './@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {PagesModule} from "./pages/pages.module";
import {NbAlertModule} from "@nebular/theme";
import {HttpHeadersInterceptor} from "./@core/services/http.interceptor";
import {PreloadInitializer} from "./@core/services/preload.initializer";
import {GlobalErrorHandler} from "./@core/services/error-handler.provider";


export function PreloadInitializerProviderFactory(provider: PreloadInitializer) {
  return () => provider.startupConfig();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PagesModule,
    HttpClientModule,

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true },
    { provide: APP_INITIALIZER,
      useFactory: PreloadInitializerProviderFactory,
      deps: [PreloadInitializer],
      multi: true},
    { provide: ErrorHandler,
      useClass: GlobalErrorHandler }
  ],
})
export class AppModule {
}
