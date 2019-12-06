import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeGuard } from './guards/employee.guard';
import { CompanyGuard } from './guards/company.guard';
import { AdminComponent } from './main/admin/admin.component';
import { CompanyComponent } from './main/company/company.component';
import { EmployeeComponent } from './main/employee/employee.component';
import { NotFoundComponent } from './main/not-found/not-found.component';
import { AdminGuard } from './guards/admin.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: '../app/main/auth/auth.module#AuthModule'
  },
  {
    path: 'admin',
    loadChildren:() =>import('../app/main/admin/admin.module')
      .then(m => m.AdminModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'company',
    loadChildren: () => import('../app/main/company/company.module')
      .then(m => m.CompanyModule),
    canActivate: [CompanyGuard]
  },
  {
    path: 'employee',
    loadChildren: () => import('../app/main/employee/employee.module')
      .then(m => m.EmployeeModule),
    canActivate: [EmployeeGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
