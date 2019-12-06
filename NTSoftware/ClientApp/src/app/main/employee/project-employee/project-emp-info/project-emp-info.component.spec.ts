import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEmpInfoComponent } from './project-emp-info.component';

describe('ProjectEmpInfoComponent', () => {
  let component: ProjectEmpInfoComponent;
  let fixture: ComponentFixture<ProjectEmpInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectEmpInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEmpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
