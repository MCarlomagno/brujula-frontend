import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { GroupsService } from 'src/app/services/groups.service';
import { TIMES, ROLES, PLANES, MatSelectOption } from '../../../shared/const';
import { Coworker } from 'src/app/models/coworker.model';

@Component({
  selector: 'app-create-coworker',
  templateUrl: './create-coworker.component.html',
  styleUrls: ['./create-coworker.component.scss']
})
export class CreateCoworkerComponent implements OnInit {

  // times with 20min gap from 8 to 20
  times = TIMES;

  // Actual roles: Lider and Member
  roles = ROLES;

  // Standard planes, probably will get from DB
  planes = PLANES;

  // Groups for Mat select
  grupos: MatSelectOption[] = [];

  // Initial loading
  loading = false;

  // Submit loading
  loadingSubmit = false;

  // create coworkers form group
  createCoworkerForm: FormGroup;

  // Conditional form groups
  planOfiPrivadaSelected = false;
  planMovilSelected = false;

  constructor(public dialogRef: MatDialogRef<CreateCoworkerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private groupsService: GroupsService) {

  }

  ngOnInit(): void {

    // for show the spinner
    this.loading = true;

    // loads the form
    this.createCoworkerForm = new FormGroup({
      nombre: new FormControl(),
      apellido: new FormControl(),
      email: new FormControl(),
      plan: new FormControl()
    });


    // TODO: instead of load groups on Init, a better approach could be load this when the coworkers list is loaded
    // them passing the data by MAT_DIALOG_DATA.
    this.groupsService.getGroups().subscribe((groups) => {

      // sets group backend data in a more readable format for mat select
      groups.map(group => {
        this.grupos.push({
          value: group.id.toString(),
          viewValue: group.nombre
        });
      });

      // hides the spinner
      this.loading = false;
    });

  }

  // Function performed when the user selects some value in Plans mat select
  // chagens the UI based on the actual selection.
  onPlanSelected(value): void {
    console.log(value);
    if (value === '3') {
      this.planOfiPrivadaSelected = true;
    } else {
      this.planOfiPrivadaSelected = false;
    }

    if (value === '0' || value === '1') {
      this.planMovilSelected = true;
    } else {
      this.planMovilSelected = false;
    }
  }

  // closes the dialog
  close(): void {
    this.dialogRef.close();
  }

  // Loads the data in the propper structures to send all to backend in order to create
  // the coworkers, plan (if custom) and users_puestos
  submit(): void {
    // we take the planes from a harcoded structure, probably in the future we would get this from backend
    const selectedPlan = PLANES[this.createCoworkerForm.value.plan - 1];

    // we instantiate the coworker class
    const coworker: Coworker = {
      nombre: this.createCoworkerForm.value.nombre,
      apellido: this.createCoworkerForm.value.apellido,
      email: this.createCoworkerForm.value.email,
      horas_sala: selectedPlan.horas_sala,
      horas_sala_consumidas: 0,
      is_coworker: true,
      dni: '23123132123',
      fecha_nacimiento: new Date(),
      direccion: 'asdasdasd',
      celular: 'asdasdasdad',
      id_plan: this.createCoworkerForm.value.plan,
    };

    // TODO: form validation
    // TODO: instantiate users_puestos class
    // TODO: instantiate plan class if custon plan
    // TODO: send data to backend
  }

}
