import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-book-room-form',
  templateUrl: './book-room-form.component.html',
  styleUrls: ['./book-room-form.component.scss']
})
export class BookRoomFormComponent implements OnInit {

  loading = false;

  // references the #calendar in the template
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  bookRoomForm: FormGroup;

  calendarOptions: CalendarOptions = {
    // spanish language
    locales: [esLocale],
    contentHeight: innerHeight - 300,
    select: this.handleSelect.bind(this),
    // free version (open source)
    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
    timeZone: 'UTC',
    initialView: innerWidth > 700 ? 'timeGridWeek' : 'timelineWeek',
    slotDuration: '00:20:00',
    slotMinTime: '08:00',
    slotMaxTime: '20:00',
    editable: true,
    selectable: true,
    eventBackgroundColor: '#E65100',
    selectMirror: true,
    headerToolbar: {
      left: '',
      center: 'title',
      right: ''
    },
  };

  constructor() { }

  ngOnInit(): void {
    // loads the form
    this.bookRoomForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
  }

  submit(): void {

  }


  handleSelect(arg?): void {

  }
}
