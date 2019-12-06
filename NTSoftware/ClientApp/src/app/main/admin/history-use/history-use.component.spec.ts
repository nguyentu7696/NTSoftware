import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryUseComponent } from './history-use.component';

describe('HistoryUseComponent', () => {
  let component: HistoryUseComponent;
  let fixture: ComponentFixture<HistoryUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
