"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.CalendarComponent = exports.SevenDaysRangeSelectionStrategy = void 0;
var core_1 = require("@angular/core");
var es_1 = require("@fullcalendar/core/locales/es");
var dialog_1 = require("@angular/material/dialog");
var calendar_event_component_1 = require("./calendar-event/calendar-event.component");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var datepicker_1 = require("@angular/material/datepicker");
var SevenDaysRangeSelectionStrategy = /** @class */ (function () {
    function SevenDaysRangeSelectionStrategy(dateAdapter) {
        this.dateAdapter = dateAdapter;
    }
    SevenDaysRangeSelectionStrategy.prototype.selectionFinished = function (date) {
        return this._createSevenDaysRange(date);
    };
    SevenDaysRangeSelectionStrategy.prototype.createPreview = function (activeDate) {
        return this._createSevenDaysRange(activeDate);
    };
    SevenDaysRangeSelectionStrategy.prototype._createSevenDaysRange = function (date) {
        if (date) {
            var start = this.dateAdapter.addCalendarDays(date, -3);
            var end = this.dateAdapter.addCalendarDays(date, 3);
            return new datepicker_1.DateRange(start, end);
        }
        return new datepicker_1.DateRange(null, null);
    };
    SevenDaysRangeSelectionStrategy = __decorate([
        core_1.Injectable()
    ], SevenDaysRangeSelectionStrategy);
    return SevenDaysRangeSelectionStrategy;
}());
exports.SevenDaysRangeSelectionStrategy = SevenDaysRangeSelectionStrategy;
var CalendarComponent = /** @class */ (function () {
    function CalendarComponent(matDialog, platformId, calendarService) {
        this.matDialog = matDialog;
        this.calendarService = calendarService;
        // loading flag
        this.loading = false;
        // reloading flag
        this.reloading = false;
        this.calendarOptions = {
            // spanish language
            locales: [es_1["default"]],
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
            }
        };
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.isBrowser = common_1.isPlatformBrowser(platformId);
    }
    CalendarComponent.prototype.ngOnInit = function () {
        // loads the form
        this.filterForm = new forms_1.FormGroup({
            sala: new forms_1.FormControl({ value: '' }, []),
            start: new forms_1.FormControl({ value: '' }, []),
            end: new forms_1.FormControl({ value: '' }, [])
        });
    };
    CalendarComponent.prototype.ngAfterViewInit = function (reloading) {
        var _this = this;
        // loads the calendar api
        this.calendarApi = this.calendarComponent.getApi();
        // cleans the calendar
        this.calendarApi.removeAllEvents();
        // current week start
        var currentStart = this.calendarApi.view.currentStart;
        // current week end
        var currentEnd = this.calendarApi.view.currentEnd;
        // adds a day on origin
        var fixedStartForPicker = currentStart;
        fixedStartForPicker.setDate(fixedStartForPicker.getDate() + 1);
        // shows loading flag
        var idSala;
        if (!reloading) {
            this.loading = true;
        }
        else {
            this.reloading = true;
            idSala = this.filterForm.controls.sala.value;
        }
        this.calendarService.getRoomsReservations(currentStart, currentEnd, idSala).subscribe(function (result) {
            _this.events = result.data.reservations;
            for (var _i = 0, _a = _this.events; _i < _a.length; _i++) {
                var event = _a[_i];
                console.log(event);
                _this.calendarApi.addEvent(event);
            }
            // hides loading flag
            if (reloading) {
                _this.reloading = false;
            }
            else {
                _this.salas = result.data.salas;
                _this.filterForm.controls.sala.setValue(_this.salas[0].id);
                _this.filterForm.controls.start.setValue(fixedStartForPicker);
                _this.filterForm.controls.end.setValue(currentEnd);
                _this.loading = false;
            }
        });
    };
    CalendarComponent.prototype.handleSelect = function (arg) {
        var _this = this;
        var dialogConfig = new dialog_1.MatDialogConfig();
        if (arg) {
            dialogConfig.data = { start: arg.start, end: arg.end, id_sala: this.filterForm.controls.sala.value, salas: this.salas };
        }
        else {
            dialogConfig.data = { start: '', end: '', id_sala: this.filterForm.controls.sala.value, salas: this.salas };
        }
        dialogConfig.panelClass = 'calendar-evert-dialog-container';
        dialogConfig.disableClose = true;
        var ref = this.matDialog.open(calendar_event_component_1.CalendarEventComponent, dialogConfig);
        // this.handleModalPosition(ref, arg);
        ref.afterClosed().subscribe(function (result) {
            if (!result) {
                // delete selection
                var calendarApi = arg.view.calendar;
                calendarApi.unselect();
            }
            else {
                _this.ngAfterViewInit(true);
            }
        });
    };
    CalendarComponent.prototype.selectWeek = function (initialDate) {
        var dayOfTheWeek = initialDate.getDay();
        this.calendarApi.setOption('firstDay', dayOfTheWeek);
        this.calendarApi.gotoDate(initialDate);
    };
    CalendarComponent.prototype.searchEvents = function () {
        this.ngAfterViewInit(true);
    };
    __decorate([
        core_1.ViewChild('calendar')
    ], CalendarComponent.prototype, "calendarComponent");
    CalendarComponent = __decorate([
        core_1.Component({
            selector: 'app-calendar',
            templateUrl: './calendar.component.html',
            styleUrls: ['./calendar.component.scss'],
            providers: [{
                    provide: datepicker_1.MAT_DATE_RANGE_SELECTION_STRATEGY,
                    useClass: SevenDaysRangeSelectionStrategy
                }]
        }),
        __param(1, core_1.Inject(core_1.PLATFORM_ID))
    ], CalendarComponent);
    return CalendarComponent;
}());
exports.CalendarComponent = CalendarComponent;
