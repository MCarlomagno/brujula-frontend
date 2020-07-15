import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    locales: [esLocale],
    dateClick: this.handleDateClick.bind(this),
    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
    timeZone: 'UTC',
    initialView: 'timeGridWeek',
    slotDuration: '00:20:00',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'resourceTimeGridDay,resourceTimeGridWeek'
    },
  };

  constructor() { }

  ngOnInit(): void {
  }

  handleDateClick(arg): void {
    console.log('date click! ' + arg.dateStr);
  }
}
