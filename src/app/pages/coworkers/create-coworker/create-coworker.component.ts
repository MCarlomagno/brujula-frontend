import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { GroupsService } from 'src/app/services/groups.service';
import { TIMES, ROLES, PLANES, MatSelectOption } from '../../../shared/const';
import { Coworker } from 'src/app/models/coworker.model';
import { UsersPuestos } from 'src/app/models/users-puestos.model';

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

  selectedDays = [true, true, true, true, true];

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
      plan: new FormControl(),
      dni: new FormControl(),
      celular: new FormControl(),
      direccion: new FormControl(),
      fecha_nacimiento: new FormControl(),
      grupo: new FormControl(),
      rol: new FormControl(),
      hora_desde: new FormControl(),
      hora_hasta: new FormControl(),
      fecha_desde: new FormControl(),
      fecha_hasta: new FormControl(),
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
    if (value === 4) {
      this.planOfiPrivadaSelected = true;
    } else {
      this.planOfiPrivadaSelected = false;
    }

    if (value === 1 || value === 2) {
      this.planMovilSelected = true;
    } else {
      this.planMovilSelected = false;
    }
  }

  // handles the checkbox press event
  onCheckboxPressed(index: number): void {
    this.selectedDays[index] = !this.selectedDays[index];
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
      dni: this.createCoworkerForm.value.dni,
      fecha_nacimiento: this.createCoworkerForm.value.fecha_nacimiento,
      direccion: this.createCoworkerForm.value.direccion,
      celular: this.createCoworkerForm.value.celular,
      id_plan: this.createCoworkerForm.value.plan,
      id_grupo: this.createCoworkerForm.value.grupo,
    };

    // for set lider_id in group
    const isGroupLeader = this.createCoworkerForm.value.rol === '0';

    // Users puestos instance
    const usersPuestos: UsersPuestos = {
      hora_desde: { hours: this.createCoworkerForm.value.hora_desde.split(':')[0], minutes: this.createCoworkerForm.value.hora_desde.split(':')[1] },
      hora_hasta: { hours: this.createCoworkerForm.value.hora_hasta.split(':')[0], minutes: this.createCoworkerForm.value.hora_hasta.split(':')[1] },
      fecha_desde: this.createCoworkerForm.value.fecha_desde,
      fecha_hasta: this.createCoworkerForm.value.fecha_hasta,
      dias: this.selectedDays
    };

    // TODO: form validation
    // TODO: send data to backend
  }

}