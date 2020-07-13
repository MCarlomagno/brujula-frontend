import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { CoworkersComponent } from './pages/coworkers/coworkers.component';
import { GroupsComponent } from './pages/groups/groups.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardGuard],
    children: [
      {
        path: 'coworkers',
        component: CoworkersComponent,
      },
      {
        path: 'groups',
        component: GroupsComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
