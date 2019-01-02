import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisationTeamComponent } from './realisation-team.component';

describe('RealisationTeamComponent', () => {
  let component: RealisationTeamComponent;
  let fixture: ComponentFixture<RealisationTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealisationTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealisationTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
