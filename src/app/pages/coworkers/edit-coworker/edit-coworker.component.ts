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
import { Plan } from 'src/app/models/plan.model';
import { Grupo } from 'src/app/models/group.model';

@Component({
  selector: 'app-edit-coworker',
  templateUrl: './edit-coworker.component.html',
  styleUrls: ['./edit-coworker.component.scss']
})
export class EditCoworkerComponent implements OnInit {

  // times with 20min gap from 8 to 20
  times = TIMES_PUESTO;

  // Actual roles: Lider and Member
  roles = ROLES;

  // Standard planes, probably will get from DB
  planes = PLANES;

  // Groups for Mat select
  grupos: Grupo[] = [];

  // Initial loading
  loading = false;

  // loading particular flags to set general loading
  coworkersLoading = false;
  groupsLoading = false;

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

  // current coworker
  coworker: Coworker;

  // current plan
  plan: Plan;

  // current group
  grupo: Grupo;

  selectedDays = [true, true, true, true, true, false];

  constructor(
    public dialogRef: MatDialogRef<EditCoworkerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupsService: GroupsService,
    private cowortersService: CoworkersService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    // for show the spinner
    this.loading = true;

    // sets the particular loadings in true
    this.coworkersLoading = true;
    this.groupsLoading = true;

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
    this.groupsService.getGroups().subscribe((groups) => {

      // sets group backend data in a more readable format for mat select
      this.grupos = groups;
      // hides the spinner
      this.groupsLoading = false;


      // get coworker by id
      this.cowortersService.getCoworkerById(this.data.id).subscribe((result) => {
        this.coworker = result;
        console.log(this.coworker);
        this.coworkersLoading = false;

        // sets personal data
        this.createCoworkerForm.controls.nombre.setValue(this.coworker.nombre);
        this.createCoworkerForm.controls.apellido.setValue(this.coworker.apellido);
        this.createCoworkerForm.controls.email.setValue(this.coworker.email);
        this.createCoworkerForm.controls.dni.setValue(this.coworker.dni);
        this.createCoworkerForm.controls.direccion.setValue(this.coworker.direccion);
        this.createCoworkerForm.controls.celular.setValue(this.coworker.celular);
        this.createCoworkerForm.controls.fecha_nacimiento.setValue(this.coworker.fecha_nacimiento);

        // if is not in the array of constants means its custom
        const notCustomPlan = this.planes.some(plan => plan.id === this.coworker.id_plan);

        if (!notCustomPlan) {
          // push the custom plan to show it in select

          // TODO get horas sala of this plan
          this.planes.push({
            id: this.coworker.id_plan,
            nombre: 'Custom',
            descripcion: 'Custom',
            horas_sala: 0,
            is_custom: true
          });
        }

        // sets plan
        this.createCoworkerForm.controls.plan.setValue(this.coworker.id_plan);
        this.plan = this.planes.find(plan => plan.id === this.coworker.id_plan);


        // sets horas_sala
        this.createCoworkerForm.controls.horas_sala.setValue(this.plan.horas_sala);

        // sets group
        this.createCoworkerForm.controls.grupo.setValue(this.coworker.id_grupo);

        if (this.coworker.id_grupo) {

          this.grupo = this.grupos.find(grupo => grupo.id === this.coworker.id_grupo);

          // sets role
          if (this.grupo.id_lider === this.coworker.id) {
            this.createCoworkerForm.controls.rol.setValue('0');
          } else {
            this.createCoworkerForm.controls.rol.setValue('1');
          }

        }

        // checks if all the data is loaded
        this.validateLoading();
      });

      // checks if all the data is loaded
      this.validateLoading();
    });

  }

  validateLoading(): void {
    if (!this.coworkersLoading && !this.groupsLoading) {
      this.loading = false;
    }
  }

  // Function performed when the user selects some value in Plans mat select
  // chagens the UI based on the actual selection.
  onPlanSelected(value): void {

    switch (value) {
      case 1: {
        this.createCoworkerForm.controls.horas_sala.setValue(2);
        this.planMovilSelected = true;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = false;
        break;
      }
      case 2: {
        this.createCoworkerForm.controls.horas_sala.setValue(4);
        this.planMovilSelected = true;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = false;
        break;
      }
      case 3: {
        this.createCoworkerForm.controls.horas_sala.setValue(4);
        this.planMovilSelected = false;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = true;
        this.createCoworkerForm.controls.hora_desde.setValue('8:00');
        this.createCoworkerForm.controls.hora_hasta.setValue('20:00');
        break;
      }
      case 4: {
        this.createCoworkerForm.controls.horas_sala.setValue(4);
        this.planMovilSelected = false;
        this.planOfiPrivadaSelected = true;
        this.planFijoSelected = true;
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

  onHorasSalaChange(): void {

  }

  // closes the dialog
  close(): void {
    this.dialogRef.close(false);
  }

  // Loads the data in the propper structures to send all to backend in order to create
  // the coworkers, plan (if custom) and users_puestos
  submit(): void {

    // if (this.createCoworkerForm.valid) {
    //   this.loadingSubmit = true;
    //   // we take the planes from a harcoded structure, probably in the future we would get this from backend
    //   const selectedPlan = PLANES[this.createCoworkerForm.value.plan - 1];

    //   // if the user changed the horas_sala parameter it's a custom plan
    //   if (selectedPlan.horas_sala !== this.createCoworkerForm.controls.horas_sala.value) {
    //     selectedPlan.horas_sala = this.createCoworkerForm.controls.horas_sala.value;
    //     selectedPlan.is_custom = true;
    //   }

    //   // we instantiate the coworker class
    //   const coworker: Coworker = {
    //     nombre: this.createCoworkerForm.value.nombre,
    //     apellido: this.createCoworkerForm.value.apellido,
    //     email: this.createCoworkerForm.value.email,
    //     horas_sala: selectedPlan.horas_sala,
    //     horas_sala_consumidas: 0,
    //     is_coworker: true,
    //     dni: this.createCoworkerForm.value.dni,
    //     fecha_nacimiento: this.createCoworkerForm.value.fecha_nacimiento,
    //     direccion: this.createCoworkerForm.value.direccion,
    //     celular: this.createCoworkerForm.value.celular,
    //     id_plan: this.createCoworkerForm.value.plan,
    //     id_grupo: this.createCoworkerForm.value.grupo,
    //     is_leader: this.createCoworkerForm.value.rol === '0',
    //   };

    //   let usersPuestos: UsersPuestos;

    //   // Users puestos instance
    //   if (selectedPlan.id !== 4) {
    //     usersPuestos = {
    //       hora_desde: {
    //         hours: this.createCoworkerForm.value.hora_desde.split(':')[0],
    //         minutes: this.createCoworkerForm.value.hora_desde.split(':')[1]
    //       },
    //       hora_hasta: {
    //         hours: this.createCoworkerForm.value.hora_hasta.split(':')[0],
    //         minutes: this.createCoworkerForm.value.hora_hasta.split(':')[1]
    //       },
    //       fecha_desde: this.createCoworkerForm.value.fecha_desde,
    //       fecha_hasta: this.createCoworkerForm.value.fecha_hasta,
    //       dias: this.selectedDays
    //     };
    //   }


    //   this.cowortersService.createCoworker(coworker, usersPuestos, selectedPlan).subscribe((response) => {
    //     if (!response.success) {
    //       this.onError(response.error);
    //     } else {
    //       this.onSuccess();
    //     }

    //   },
    //     (err) => this.onError(err));
    // }
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
