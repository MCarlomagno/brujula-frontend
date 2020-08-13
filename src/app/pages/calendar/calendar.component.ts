import { Component, OnInit, PLATFORM_ID, Inject, Injectable, ViewChild, AfterViewInit } from '@angular/core';
import { CalendarOptions, FullCalendarComponent, Calendar } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CalendarEventComponent } from './calendar-event/calendar-event.component';
import { isPlatformBrowser } from '@angular/common';
import { SalasService } from '../../services/salas.service';
import { Sala } from 'src/app/models/sala.model';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDateRangeSelectionStrategy, DateRange, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { CalendarService } from 'src/app/services/calendar.service';
import { Event } from 'src/app/models/event.model';

@Injectable()
export class SevenDaysRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private dateAdapter: DateAdapter<D>) { }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createSevenDaysRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createSevenDaysRange(activeDate);
  }

  private _createSevenDaysRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this.dateAdapter.addCalendarDays(date, -3);
      const end = this.dateAdapter.addCalendarDays(date, 3);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [{
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: SevenDaysRangeSelectionStrategy
  }]
})

export class CalendarComponent implements OnInit, AfterViewInit {

  // references the #calendar in the template
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  // checks if the platform is browser to show the dialog in paticular zone of the screen
  isBrowser: boolean;

  // detects width to show the dialog at left if overfows the screen
  public innerWidth: any;
  public innerHeight: any;

  // form group
  filterForm: FormGroup;

  // salas
  salas: Sala[];

  // reservations
  events: Event[];

  // loading flag
  loading = false;

  // reloading flag
  reloading = false;

  // references the calendar
  calendarApi: Calendar;

  calendarOptions: CalendarOptions = {
    // spanish language
    locales: [esLocale],
    contentHeight: innerHeight - 300,
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
      left: '',
      center: 'title',
      right: ''
    },
  };

  constructor(
    private matDialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: string,
    private calendarService: CalendarService) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {

    // loads the form
    this.filterForm = new FormGroup({
      sala: new FormControl({ value: '' }, []),
      start: new FormControl({ value: '' }, []),
      end: new FormControl({ value: '' }, []),
    });
  }

  ngAfterViewInit(reloading?: boolean): void {

    // loads the calendar api
    this.calendarApi = this.calendarComponent.getApi();

    // cleans the calendar
    this.calendarApi.removeAllEvents();

    // current week start
    const currentStart = this.calendarApi.view.currentStart;
    // current week end
    const currentEnd = this.calendarApi.view.currentEnd;

    // adds a day on origin
    const fixedStartForPicker = currentStart;
    fixedStartForPicker.setDate(fixedStartForPicker.getDate() + 1);

    // shows loading flag
    let idSala;
    if (!reloading) {
      this.loading = true;
    } else {
      this.reloading = true;
      idSala = this.filterForm.controls.sala.value;
    }

    this.calendarService.getRoomsReservations(currentStart, currentEnd, idSala).subscribe((result) => {

      this.events = result.data.reservations;

      for (const event of this.events) {
        this.calendarApi.addEvent(event);
      }

      // hides loading flag
      if (reloading) {
        this.reloading = false;
      } else {
        this.salas = result.data.salas;
        this.filterForm.controls.sala.setValue(this.salas[0].id);
        this.filterForm.controls.start.setValue(fixedStartForPicker);
        this.filterForm.controls.end.setValue(currentEnd);
        this.loading = false;
      }
    });

  }

  handleSelect(arg?): void {
    const dialogConfig = new MatDialogConfig();
    if (arg) {
      dialogConfig.data = { start: arg.start, end: arg.end, id_sala: this.filterForm.controls.sala.value, salas: this.salas };
    } else {
      dialogConfig.data = { start: '', end: '', id_sala: this.filterForm.controls.sala.value, salas: this.salas };
    }

    dialogConfig.panelClass = 'calendar-evert-dialog-container';
    dialogConfig.disableClose = true;
    const ref: MatDialogRef<CalendarEventComponent> = this.matDialog.open(CalendarEventComponent, dialogConfig);

    // this.handleModalPosition(ref, arg);

    ref.afterClosed().subscribe((result) => {
      if (!result) {
        // delete selection
        const calendarApi = arg.view.calendar;
        calendarApi.unselect();
      } else {
        this.ngAfterViewInit(true);
      }

    });
  }

  selectWeek(initialDate: Date): void {
    const dayOfTheWeek = initialDate.getDay();
    this.calendarApi.setOption('firstDay', dayOfTheWeek);
    this.calendarApi.gotoDate(initialDate);
  }

  searchEvents(): void {
    this.ngAfterViewInit(true);
  }

  // handleModalPosition(ref, arg): void {

  //   // dialog height and width
  //   const dialogWidth = 400;
  //   const dialogHeight = 200;

  //   // overflow flags
  //   const overflowWidth = (this.innerWidth - arg.jsEvent.clientX) < dialogWidth;
  //   const overflowHeight = (this.innerHeight - arg.jsEvent.clientY) < dialogHeight;

  //   if (!overflowWidth && !overflowHeight) {
  //     ref.updatePosition({ left: (arg.jsEvent.clientX) + 'px', top: arg.jsEvent.clientY - 200 + 'px' });
  //   } else if (overflowWidth && !overflowHeight) {
  //     ref.updatePosition({ left: (arg.jsEvent.clientX - 400) + 'px', top: arg.jsEvent.clientY - 200 + 'px' });
  //   } else if (!overflowWidth && overflowHeight) {
  //     ref.updatePosition({ left: arg.jsEvent.clientX + 'px', top: (arg.jsEvent.clientY - 400) + 'px' });
  //   } else if (overflowWidth && overflowHeight) {
  //     ref.updatePosition({ left: (arg.jsEvent.clientX - 400) + 'px', top: (arg.jsEvent.clientY - 400) + 'px' });
  //   }
  // }
}



