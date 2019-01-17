import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ns-realisation-team',
  templateUrl: './realisation-team.component.html',
  styleUrls: ['./realisation-team.component.scss'],
})
export class RealisationTeamComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // TODO: after user management implementation -> user real values from db
  public team: any[] = [
    {
      username: 'Hashish',
      teamFunction: 'Prezident klubu',
      contacts: [
        { icon: 'ion-ios-mail', value: 'mailto:ota.vasak@seznam.cz' },
      ],
    },
    {
      username: 'El Capitano',
      teamFunction: 'Generální manažer',
      contacts: [
        { icon: 'ion-ios-call', value: 'tel:+420739541541' },
        { icon: 'ion-ios-mail', value: 'mailto:northern.stars@seznam.cz' },
      ],
    },
    {
      username: 'Kašpi',
      teamFunction: 'Víceprezident pro hokejové operace',
      contacts: [
        { icon: 'ion-ios-mail', value: 'mailto:kaspar@syner.cz' },
      ],
    },
    {
      username: 'Marcello',
      teamFunction: 'Marketingový ředitel',
      contacts: [
        { icon: 'ion-ios-mail', value: 'mailto:m.spesny@pmh.cz' },
      ],
    },
    {
      username: 'Dědek',
      teamFunction: 'PR Manager',
      contacts: [
        { icon: 'ion-ios-call', value: 'tel:+420724245515' },
        { icon: 'ion-ios-mail', value: 'mailto:ditrich.martin@gmail.com' },
      ],
    },
  ];

}
