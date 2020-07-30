import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss']
})
export class CalendarEventComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CalendarEventComponent>) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
