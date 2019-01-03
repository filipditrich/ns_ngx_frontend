import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SysInfoPipe, TranslatePipe } from './pipes';
import { HumanizerHelper } from './helpers';
import { LocalDatePipe } from './pipes/local-date.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TranslatePipe,
    SysInfoPipe,
    LocalDatePipe,
  ],
  providers: [
    HumanizerHelper,
  ],
  exports: [
    TranslatePipe,
    SysInfoPipe,
    LocalDatePipe,
  ],
})
export class SharedModule { }
