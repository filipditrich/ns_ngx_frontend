import { Pipe, PipeTransform } from '@angular/core';
import { translate } from '../helpers/translator.helper';

@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {

  transform(id: string, data?: any, lang?: string): string {
    return translate(id, data, lang);
  }

}
