import { Component, OnInit, PLATFORM_ID, Inject, Injectable, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CalendarEventComponent } from './calendar-event/calendar-event.component';
import { isPlatformBrowser } from '@angular/common';
import { SalasService } from '../../services/salas.service';
import { Sala } from 'src/app/models/sala.model';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDateRangeSelectionStrategy, DateRange, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';

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

export class CalendarComponent implements OnInit {

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

  // loading flag
  loading = false;

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
      right: 'prev,next'
    },
  };

  constructor(
    private matDialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: string,
    private salasService: SalasService) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {

    // shows loading flag
    this.loading = true;

    // loads the form
    this.filterForm = new FormGroup({
      sala: new FormControl({ value: '' }, []),
      start: new FormControl({ value: '' }, []),
      end: new FormControl({ value: '' }, []),
    });

    this.salasService.getSalas().subscribe((result) => {
      this.salas = result;

      this.filterForm.controls.sala.setValue(this.salas[0].id);

      // hides loading flag
      this.loading = false;
    });
  }

  loadCalendar(): void {

  }

  handleSelect(arg): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { start: arg.start, end: arg.end, id_sala: this.filterForm.controls.sala.value };
    dialogConfig.panelClass = 'calendar-evert-dialog-container';
    const ref: MatDialogRef<CalendarEventComponent> = this.matDialog.open(CalendarEventComponent, dialogConfig);
    // if (this.isBrowser) {
    this.handleModalPosition(ref, arg);

    // }
    ref.afterClosed().subscribe((result) => {
      if (!result) {
        // delete selection
        const calendarApi = arg.view.calendar;
        calendarApi.unselect();
      }

    });
  }

  selectWeek(initialDate: Date): void {

    const dayOfTheWeek = initialDate.getDay();

    // loads the calendar api
    const calendarApi = this.calendarComponent.getApi();


    calendarApi.setOption('firstDay', dayOfTheWeek);
    calendarApi.gotoDate(initialDate);
  }

  handleModalPosition(ref, arg): void {

    // dialog height and width
    const dialogWidth = 400;
    const dialogHeight = 200;

    // overflow flags
    const overflowWidth = (this.innerWidth - arg.jsEvent.clientX) < dialogWidth;
    const overflowHeight = (this.innerHeight - arg.jsEvent.clientY) < dialogHeight;

    if (!overflowWidth && !overflowHeight) {
      ref.updatePosition({ left: (arg.jsEvent.clientX) + 'px', top: arg.jsEvent.clientY - 200 + 'px' });
    } else if (overflowWidth && !overflowHeight) {
      ref.updatePosition({ left: (arg.jsEvent.clientX - 400) + 'px', top: arg.jsEvent.clientY - 200 + 'px' });
    } else if (!overflowWidth && overflowHeight) {
      ref.updatePosition({ left: arg.jsEvent.clientX + 'px', top: (arg.jsEvent.clientY - 400) + 'px' });
    } else if (overflowWidth && overflowHeight) {
      ref.updatePosition({ left: (arg.jsEvent.clientX - 400) + 'px', top: (arg.jsEvent.clientY - 400) + 'px' });
    }
  }
}



