import { Pipe, PipeTransform } from '@angular/core';
import { sysInfo } from '../helpers/sysinfo.helper';

@Pipe({
  name: 'sysinfo',
})
export class SysInfoPipe implements PipeTransform {

  transform(id: string): string {
    return sysInfo(id);
  }

}
