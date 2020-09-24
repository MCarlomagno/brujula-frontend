import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { AdminGuard } from './guards/admin.guard';
import { LeaderGuard } from './guards/leader.guard';
import { CoworkersComponent } from './pages/coworkers/coworkers.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { GroupManagementComponent } from './pages/group-management/group-management.component';
import { BookRoomFormComponent } from './pages/book-room-form/book-room-form.component';
import { BuyRoomHoursComponent } from './pages/buy-room-hours/buy-room-hours.component';

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
        path: 'my-account',
        component: MyAccountComponent,
        pathMatch: 'full',
      },
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'coworkers',
        component: CoworkersComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'groups',
        component: GroupsComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'groups-management',
        component: GroupManagementComponent,
        canActivate: [LeaderGuard],
      },
    ]
  }, {
    path: 'book-room',
    component: BookRoomFormComponent
  }, {
    path: 'buy-room-hours',
    component: BuyRoomHoursComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
