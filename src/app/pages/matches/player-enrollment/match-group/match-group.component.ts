import { Component, OnInit } from '@angular/core';
import { PlayerEnrollmentComponent } from '../player-enrollment.component';
import { MatchesService } from '../../../admin/matches';
import { UserService } from '../../../user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHelper, HumanizerHelper } from '../../../../@shared/helpers';
import { ToasterService } from 'angular2-toaster';
import { GroupsService } from '../../../admin/groups';
import * as codeConfig from '../../../../@shared/config/codes.config';
import * as moment from 'moment';

@Component({
  selector: 'ns-match-group',
  templateUrl: './match-group.component.html',
  styleUrls: ['./match-group.component.scss'],
})
export class MatchGroupComponent extends PlayerEnrollmentComponent implements OnInit {

  public matchGroup: string;
  constructor(public matchesService: MatchesService,
              public errorHelper: ErrorHelper,
              public humanizer: HumanizerHelper,
              public toasterService: ToasterService,
              public userService: UserService,
              public modalService: NgbModal,
              public router: Router,
              private activatedRoute: ActivatedRoute,
              private groupsService: GroupsService) {
    super(matchesService, errorHelper, humanizer, toasterService, userService, modalService, router);
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(map => {
      const stripped = map.get('group').replace('-', ' ');
      const ogn = this.activatedRoute.snapshot.queryParamMap.get('ogn');
      this.groupsService.getByName(ogn).subscribe(response => {
        if (response.response.success) {
          this.matchGroup = response.output.name;
          this.storagePrefName = `${stripped.replace('-', '_').toLowerCase()}Group`;
          this.loadData();
          this.loadPreferences();
        } else {
          this.router.navigate(['/pages/matches']).then(() => {
            this.errorHelper.processedButFailed(response);
          });
        }
      }, error => {
        this.router.navigate(['/pages/matches']).then(() => {
          this.errorHelper.handleGenericError(error);
        });
      });
    });
  }

  /**
   * @description Loads Matches from server
   */
  loadData() {
    this.isLoading = true;
    this.matchesService.getByGroupName(this.matchGroup).subscribe(response => {
      if (response.response.success) {
        const showOlder = this.filterOptions.showPast.value;
        const matches = showOlder ? response.output : response.output.filter(x => !moment(x.date).isSameOrBefore(this.now));
        this.source.load(matches).then(() => {
          this.source.setSort([{ field: 'date', direction: 'desc' }]);
          this.applyPreferences();
          this.isLoading = false;
        });
      } else {
        this.errorHelper.processedButFailed(response);
      }
    }, err => {
      const error = !!err.error ? !!err.error.response ? err.error.response : err.error : err;

      switch (error.name || error.type) {
        case codeConfig.getCodeByName('NO_MATCHS_FOUND', 'core').name: {
          this.source.load([]).then(() => { this.isLoading = false; });
          break;
        }
        default: {
          this.errorHelper.handleGenericError(err);
          break;
        }
      }
    });
  }

}
