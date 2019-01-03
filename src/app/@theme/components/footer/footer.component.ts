import { Component } from '@angular/core';
import { sysInfo } from '../../../@shared/helpers';

@Component({
  selector: 'ns-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <div class="w-100 d-flex flex-wrap justify-content-between">
      <span>{{ 'copyright' | sysinfo }} <a [href]="aou" class="link">{{ 'appOwnerName' | sysinfo }}</a></span>
      <!--<span>by <a [href]="acu" class="link">{{ 'appCreatorName' | sysinfo }}</a></span>-->
    </div>
  `,
})
export class FooterComponent {
  public acu = sysInfo('appCreatorUrl');
  public aou = sysInfo('appOwnerUrl');
}
