import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEmpLstComponent } from './project-emp-lst.component';

describe('ProjectEmpLstComponent', () => {
  let component: ProjectEmpLstComponent;
  let fixture: ComponentFixture<ProjectEmpLstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectEmpLstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEmpLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
