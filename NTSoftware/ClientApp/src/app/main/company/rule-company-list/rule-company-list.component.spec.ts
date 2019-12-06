import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCompanyListComponent } from './rule-company-list.component';

describe('RuleCompanyListComponent', () => {
  let component: RuleCompanyListComponent;
  let fixture: ComponentFixture<RuleCompanyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleCompanyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
