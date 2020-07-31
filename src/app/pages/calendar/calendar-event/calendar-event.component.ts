import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CoworkersService } from 'src/app/services/coworkers.service';
import { User } from '../../../models/user.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss']
})
export class CalendarEventComponent implements OnInit {

  // users
  users: User[];

  // loading flag
  loading = false;

  // users filter
  userControl = new FormControl();
  userNames: string[];
  filteredUsers: Observable<User[]>;

  constructor(
    public dialogRef: MatDialogRef<CalendarEventComponent>,
    private coworkersService: CoworkersService
  ) { }

  ngOnInit(): void {
    // shows spinner
    this.loading = true;

    this.coworkersService.getUsers().subscribe((users) => {
      // current users
      this.users = users;

      // user names
      this.userNames = this.users.map(u => u.nombre);

      this.filteredUsers = this.userControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );

      // hides spinner
      this.loading = false;
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(users =>
      users.nombre.toLowerCase().includes(filterValue) ||
      users.apellido.toLowerCase().includes(filterValue));
  }
}
