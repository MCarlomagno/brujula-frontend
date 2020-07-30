import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CalendarEventComponent } from './calendar-event/calendar-event.component';
import { isPlatformBrowser } from '@angular/common';


const SALAS = [{ id: 1, nombre: 'Sala 1' },
         { id: 1, nombre: 'Sala 2' }];


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  // checks if the platform is browser to show the dialog in paticular zone of the screen
  isBrowser: boolean;

  // detects width to show the dialog at left if overfows the screen
  public innerWidth: any;
  public innerHeight: any;

  // salas
  salas = [...SALAS];

  calendarOptions: CalendarOptions = {
    // spanish language
    locales: [esLocale],
    contentHeight: 'auto',
    select: this.handleSelect.bind(this),
    // free version (open source)
    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
    timeZone: 'UTC',
    initialView: 'timeGridWeek',
    slotDuration: '00:20:00',
    slotMinTime: '08:00',
    slotMaxTime: '20:00',
    editable: true,
    selectable: true,
    eventBackgroundColor: '#E65100',
    selectMirror: true,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek'
    },
  };

  constructor(
    private matDialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: string) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.salas = SALAS;
  }

  loadCalendar(): void {

  }

  handleSelect(arg): void {
    console.log(arg);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.panelClass = 'calendar-evert-dialog-container';
    const ref: MatDialogRef<CalendarEventComponent> = this.matDialog.open(CalendarEventComponent, dialogConfig);
    if (this.isBrowser) {
      this.handleModalPosition(ref, arg);

    }
    ref.afterClosed().subscribe((result) => {
      if (!result) {
        // delete selection
        const calendarApi = arg.view.calendar;
        calendarApi.unselect();
      }

    });
  }



  handleModalPosition(ref, arg): void {

    // dialog height and width
    const dialogWidth = 400;
    const dialogHeight = 200;

    // overflow flags
    const overflowWidth = (this.innerWidth - arg.jsEvent.clientX) < dialogWidth;
    const overflowHeight = (this.innerHeight - arg.jsEvent.clientY) < dialogHeight;

    if (!overflowWidth && !overflowHeight) {
      ref.updatePosition({ left: (arg.jsEvent.clientX) + 'px', top: arg.jsEvent.clientY + 'px' });
    } else if (overflowWidth && !overflowHeight) {
      ref.updatePosition({ left: (arg.jsEvent.clientX - 400) + 'px', top: arg.jsEvent.clientY + 'px' });
    } else if (!overflowWidth && overflowHeight) {
      ref.updatePosition({ left: arg.jsEvent.clientX + 'px', top: (arg.jsEvent.clientY - 200) + 'px' });
    } else if (overflowWidth && overflowHeight) {
      ref.updatePosition({ left: (arg.jsEvent.clientX - 400) + 'px', top: (arg.jsEvent.clientY - 200) + 'px' });
    }
  }
}
