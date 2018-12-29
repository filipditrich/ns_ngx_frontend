import { Pipe, PipeTransform } from '@angular/core';
import { translate } from '../helpers/translator.helper';
import * as removeAccents from 'remove-accents';

@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {

  transform(id: string, data?: any, lang?: string): string {
    return removeAccents(translate(id, data, lang));
  }

}
