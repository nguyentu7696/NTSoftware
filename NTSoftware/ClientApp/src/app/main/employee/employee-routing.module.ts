import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeComponent} from "./employee.component";
import {EmployeeInfoComponent} from "./employee-info/employee-info.component";
import {DepartmentInfoComponent} from "./department-info/department-info.component";


const routes: Routes = [{
  path: '',
  component: EmployeeComponent,
  children: [
    {
      path: '',
      redirectTo: 'employee-info',
    },
    {
      path: 'employee-info',
      component: EmployeeInfoComponent
    },
    {
      path: 'department-info',
      component: DepartmentInfoComponent
    },
    {
      path: 'project-employee',
      loadChildren: () => import('../employee/project-employee/project-employee.module')
        .then(m => m.ProjectEmployeeModule),
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
