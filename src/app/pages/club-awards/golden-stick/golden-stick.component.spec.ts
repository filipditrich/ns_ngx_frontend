import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldenStickComponent } from './golden-stick.component';

describe('GoldenStickComponent', () => {
  let component: GoldenStickComponent;
  let fixture: ComponentFixture<GoldenStickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldenStickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldenStickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
