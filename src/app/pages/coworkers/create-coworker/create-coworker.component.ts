import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

interface Plan {
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
