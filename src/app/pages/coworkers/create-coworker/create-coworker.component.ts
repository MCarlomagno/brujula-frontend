import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

interface Plan {
  value: string;
  viewValue: string;
}

interface Times {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-create-coworker',
  templateUrl: './create-coworker.component.html',
  styleUrls: ['./create-coworker.component.scss']
})
export class CreateCoworkerComponent implements OnInit {

  createCoworkerForm: FormGroup;
  foods: Plan[] = [
    {value: 'steak-0', viewValue: 'Movil x 6'},
    {value: 'pizza-1', viewValue: 'Movil x 12'},
    {value: 'tacos-2', viewValue: 'Fijo x 12'},
    {value: 'tacos-3', viewValue: 'Oficina privada'}
  ];

  dates: Times[] = [
    {value: '00', viewValue: '8:00'},
    {value: '01', viewValue: '8:20'},
    {value: '02', viewValue: '8:40'},
    {value: '10', viewValue: '9:00'},
    {value: '11', viewValue: '9:20'},
    {value: '12', viewValue: '9:40'},
    {value: '20', viewValue: '10:00'},
    {value: '21', viewValue: '10:20'},
    {value: '22', viewValue: '10:40'},
    {value: '30', viewValue: '11:00'},
    {value: '31', viewValue: '11:20'},
    {value: '32', viewValue: '11:40'},
    {value: '00', viewValue: '12:00'},
    {value: '01', viewValue: '12:20'},
    {value: '02', viewValue: '12:40'},
    {value: '10', viewValue: '13:00'},
    {value: '11', viewValue: '13:20'},
    {value: '12', viewValue: '13:40'},
    {value: '20', viewValue: '14:00'},
    {value: '21', viewValue: '14:20'},
    {value: '22', viewValue: '14:40'},
    {value: '30', viewValue: '15:00'},
    {value: '31', viewValue: '15:20'},
    {value: '32', viewValue: '15:40'},
    {value: '00', viewValue: '16:00'},
    {value: '01', viewValue: '16:20'},
    {value: '02', viewValue: '16:40'},
    {value: '10', viewValue: '17:00'},
    {value: '11', viewValue: '17:20'},
    {value: '12', viewValue: '17:40'},
    {value: '20', viewValue: '18:00'},
    {value: '21', viewValue: '18:20'},
    {value: '22', viewValue: '18:40'},
    {value: '30', viewValue: '19:00'},
    {value: '31', viewValue: '19:20'},
    {value: '32', viewValue: '19:40'},
    {value: '20', viewValue: '20:00'},
  ];

  checked = false;
  indeterminate = false;
  disabled = false;

  constructor(public dialogRef: MatDialogRef<CreateCoworkerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.createCoworkerForm = new FormGroup({
      nombre: new FormControl(),
      apellido: new FormControl(),
      email: new FormControl(),
      plan: new FormControl()
   });
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.dialogRef.close();
  }

}
