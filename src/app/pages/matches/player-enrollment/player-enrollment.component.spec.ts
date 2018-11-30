import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerEnrollmentComponent } from './player-enrollment.component';

describe('PlayerEnrollmentComponent', () => {
  let component: PlayerEnrollmentComponent;
  let fixture: ComponentFixture<PlayerEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerEnrollmentComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
