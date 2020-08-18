import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoworkersService } from 'src/app/services/coworkers.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { User } from '../../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TIMES_SALA } from 'src/app/shared/const';
import { Reservation } from 'src/app/models/reservation.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  userNames: string[];
  filteredUsers: Observable<User[]>;
  selectedUser: string;
  userSelected: User;

  // times each 20min
  times = TIMES_SALA;

  // create coworkers form group
  reservaForm: FormGroup;

  // flag for submit pressed
  loadingSubmit = false;

  // success message
  successMessage = 'Reserva creada con éxito';

  // error message
  errorMessage = 'Ocurrió un eror creando la reserva';

  constructor(
    public dialogRef: MatDialogRef<CalendarEventComponent>,
    private coworkersService: CoworkersService,
    private calendarService: CalendarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // shows spinner
    this.loading = true;

    // loads the form
    this.reservaForm = new FormGroup({
      user: new FormControl(null, [Validators.required]),
      fecha: new FormControl({ value: '' }, [Validators.required]),
      hora_desde: new FormControl({ value: '' }, [Validators.required]),
      hora_hasta: new FormControl({ value: '' }, [Validators.required]),
      sala: new FormControl({value: this.data.id_sala, disabled: true}, ),
    });

    this.coworkersService.getUsers().subscribe((users) => {
      // current users
      this.users = users;

      // user names
      this.userNames = this.users.map(u => u.nombre);

      this.filteredUsers = this.reservaForm.get('user').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );

      // sets controls values
      if (this.data.start && this.data.end) {
        this.reservaForm.controls.fecha.setValue(this.data.start);
        this.reservaForm.controls.hora_desde.setValue(this.formatToHours(this.data.start));
        this.reservaForm.controls.hora_hasta.setValue(this.formatToHours(this.data.end));
      }



      // hides spinner
      this.loading = false;
    });
  }

  // recieves a date and returns hh:mm string
  formatToHours(date): string {
    let hours = date.getUTCHours() + '';
    let minutes = date.getUTCMinutes() + '';
    if (hours.length < 2) {
      hours = '0' + hours;
    }

    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    return hours + ':' + minutes;
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

  userClick(event: any): void {
    this.selectedUser = event.option.value;
    this.userSelected = this.users.find(user => user.nombre + ' ' + user.apellido === this.selectedUser);
  }

  checkUser(): void {
    if (!this.selectedUser || this.selectedUser !== this.reservaForm.controls.user.value) {
      this.reservaForm.controls.user.setValue('');
      this.selectedUser = '';
    }
  }

  submit(): void {
    if (this.reservaForm.valid) {
      this.loadingSubmit = true;
      const reservation: Reservation = {
        id_user: this.userSelected.id,
        hora_desde: this.reservaForm.controls.hora_desde.value,
        hora_hasta: this.reservaForm.controls.hora_hasta.value,
        fecha: this.reservaForm.controls.fecha.value,
        id_sala: this.data.id_sala,
      };
      this.calendarService.createReservation(reservation).subscribe((response) => {
        if (response.success) {
          this.onSuccess();
        } else {
          this.onError(response.error);
        }
      },
        (err) => this.onError(err));
    }
  }

  onError(err): void {
    this.loadingSubmit = false;
    this.snackBar.open(this.errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }

  onSuccess(): void {
    this.loadingSubmit = false;
    this.dialogRef.close(true);
    this.snackBar.open(this.successMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }

}
