import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripleClubComponent } from './triple-club.component';

describe('TripleClubComponent', () => {
  let component: TripleClubComponent;
  let fixture: ComponentFixture<TripleClubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripleClubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripleClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
