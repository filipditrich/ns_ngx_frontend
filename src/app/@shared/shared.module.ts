import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SysInfoPipe, TranslatePipe } from './pipes';
import { HumanizerHelper } from './helpers';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TranslatePipe,
    SysInfoPipe,
  ],
  providers: [
    HumanizerHelper,
  ],
  exports: [
    TranslatePipe,
    SysInfoPipe,
  ],
})
export class SharedModule { }
