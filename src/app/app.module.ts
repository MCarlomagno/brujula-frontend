import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
// end material modules

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { TokenInterceptorService } from '../app/services/token-interceptor.service';
import { CoworkersComponent } from './pages/coworkers/coworkers.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { MatTableModule } from '@angular/material/table';
import { CreateCoworkerComponent } from './pages/coworkers/create-coworker/create-coworker.component';
import { CreateGroupComponent } from './pages/groups/create-group/create-group.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from './pages/calendar/calendar.component';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  resourceTimelinePlugin,
  resourceTimeGridPlugin
]);


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    CoworkersComponent,
    GroupsComponent,
    CreateCoworkerComponent,
    CreateGroupComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    FullCalendarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
  ],
  providers: [AuthGuardGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [CreateCoworkerComponent, CreateGroupComponent]
})
export class AppModule { }
