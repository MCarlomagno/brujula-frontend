import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GroupsService } from 'src/app/services/groups.service';
import { TIMES_PUESTO, ROLES, PLANES, MatSelectOption } from '../../../shared/const';
import { Coworker } from 'src/app/models/coworker.model';
import { UsersPuestos } from 'src/app/models/users-puestos.model';
import { CoworkersService } from 'src/app/services/coworkers.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-coworker',
  templateUrl: './create-coworker.component.html',
  styleUrls: ['./create-coworker.component.scss']
})
export class CreateCoworkerComponent implements OnInit {

  // times with 20min gap from 8 to 20
  times = TIMES_PUESTO;

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
  planFijoSelected = false;

  // success message
  successMessage = 'Coworker creado con éxito';

  // error message
  errorMessage = 'Ocurrió un eror creando al coworker';

  selectedDays = [true, true, true, true, true, false];

  constructor(
    public dialogRef: MatDialogRef<CreateCoworkerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupsService: GroupsService,
    private cowortersService: CoworkersService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    // for show the spinner
    this.loading = true;

    // loads the form
    this.createCoworkerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      plan: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      celular: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
      grupo: new FormControl(),
      rol: new FormControl(),
      hora_desde: new FormControl(),
      hora_hasta: new FormControl(),
      fecha_desde: new FormControl(),
      fecha_hasta: new FormControl(),
      horas_sala: new FormControl(2, [Validators.required]),
    });


    // TODO: instead of load groups on Init, a better approach could be load this when the coworkers list is loaded
    // them passing the data by MAT_DIALOG_DATA.
    this.groupsService.getAllGroups().subscribe((groups) => {

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

    switch (value) {
      case 1: {
        this.createCoworkerForm.controls.horas_sala.setValue(2);
        this.createCoworkerForm.controls.horas_sala.disable();
        this.planMovilSelected = true;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = false;
        break;
      }
      case 2: {
        this.createCoworkerForm.controls.horas_sala.setValue(4);
        this.createCoworkerForm.controls.horas_sala.disable();
        this.planMovilSelected = true;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = true;
        this.createCoworkerForm.controls.hora_desde.setValue('08:00');
        this.createCoworkerForm.controls.hora_hasta.setValue('20:00');
        break;
      }
      case 3: {
        this.createCoworkerForm.controls.horas_sala.setValue(4);
        this.createCoworkerForm.controls.horas_sala.disable();
        this.planMovilSelected = false;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = true;
        this.createCoworkerForm.controls.hora_desde.setValue('08:00');
        this.createCoworkerForm.controls.hora_hasta.setValue('20:00');
        break;
      }
      case 4: {
        this.createCoworkerForm.controls.horas_sala.setValue(4);
        this.createCoworkerForm.controls.horas_sala.enable();
        this.planMovilSelected = false;
        this.planOfiPrivadaSelected = true;
        this.planFijoSelected = true;
        break;
      }
      case 5: {
        this.createCoworkerForm.controls.horas_sala.setValue(4);
        this.createCoworkerForm.controls.horas_sala.enable();
        this.planMovilSelected = true;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = false;
        break;
      }
      default: {
        break;
      }
    }
  }

  // handles the checkbox press event
  onCheckboxPressed(index: number): void {
    this.selectedDays[index] = !this.selectedDays[index];
  }

  onHorasSalaChange(): void { }

  onHoraDesdeChange(): void {
    if (this.planMovilSelected) {
      const value = this.createCoworkerForm.controls.hora_desde.value;
      const hour = parseInt(value.split(':')[0], 10);
      if (hour + 6 <= 20) {
        const horaHastaValue = (hour + 6) + ':00';
        this.createCoworkerForm.controls.hora_hasta.setValue(horaHastaValue);
      } else {
        this.createCoworkerForm.controls.hora_hasta.setValue(null);
      }
    }
  }

  onHoraHastaChange(): void {
    if (this.planMovilSelected) {
      const value = this.createCoworkerForm.controls.hora_hasta.value;
      const hour = parseInt(value.split(':')[0], 10);
      if (hour - 6 <= 20) {
        const horaDesdeValue = (hour - 6) + ':00';
        this.createCoworkerForm.controls.hora_desde.setValue(horaDesdeValue);
      } else {
        this.createCoworkerForm.controls.hora_desde.setValue(null);
      }
    }
  }

  // closes the dialog
  close(): void {
    this.dialogRef.close(false);
  }

  // Loads the data in the propper structures to send all to backend in order to create
  // the coworkers, plan (if custom) and users_puestos
  submit(): void {

    if (this.createCoworkerForm.valid) {
      this.loadingSubmit = true;
      // we take the planes from a harcoded structure, probably in the future we would get this from backend
      const selectedPlan = PLANES[this.createCoworkerForm.value.plan - 1];

      // if the user changed the horas_sala parameter it's a custom plan
      if (selectedPlan.horas_sala !== this.createCoworkerForm.controls.horas_sala.value) {
        // concats custom to show to users that the hours are changed
        selectedPlan.nombre = selectedPlan.nombre;
        selectedPlan.horas_sala = this.createCoworkerForm.controls.horas_sala.value;
        selectedPlan.is_custom = true;
      }

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
        is_leader: this.createCoworkerForm.value.rol === 'leader',
      };

      let usersPuestos: UsersPuestos;

      // Users puestos instance
      if (selectedPlan.id !== 4) {
        usersPuestos = {
          id_user: null,
          hora_desde: this.createCoworkerForm.value.hora_desde ? {
            hours: this.createCoworkerForm.value.hora_desde.split(':')[0],
            minutes: this.createCoworkerForm.value.hora_desde.split(':')[1]
          } : null,
          hora_hasta: this.createCoworkerForm.value.hora_desde ? {
            hours: this.createCoworkerForm.value.hora_hasta.split(':')[0],
            minutes: this.createCoworkerForm.value.hora_hasta.split(':')[1]
          } : null,
          fecha_desde: this.createCoworkerForm.value.fecha_desde,
          fecha_hasta: this.createCoworkerForm.value.fecha_hasta,
          dias: this.selectedDays
        };
      }


      this.cowortersService.createCoworker(coworker, usersPuestos, selectedPlan).subscribe((response) => {
        if (!response.success) {
          this.onError(response.error);
        } else {
          this.onSuccess();
        }

      },
        (err) => this.onError(err));
    }
  }

  onError(err): void {
    this.loadingSubmit = false;
    console.log(err);
    this.snackBar.open(this.errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }

  onSuccess(): void {
    this.loadingSubmit = false;
    this.dialogRef.close(true);
    this.snackBar.open(this.successMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }

}
