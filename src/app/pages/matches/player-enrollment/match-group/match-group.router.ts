import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ns-match-group-router',
  template: `Please wait...`,
})
export class MatchGroupRouterComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const groupName = this.activatedRoute.snapshot.paramMap.get('group').replace('-', ' ').toLowerCase();
    this.router.navigate(['/pages/matches/gn/' + groupName]);
  }
}
