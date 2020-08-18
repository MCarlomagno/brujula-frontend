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
  planes = [...PLANES];

  // Groups for Mat select
  grupos: Grupo[] = [];

  // Initial loading
  loading = false;

  // Submit loading
  loadingSubmit = false;

  // create coworkers form group
  editCoworkersForm: FormGroup;

  // Conditional form groups
  planOfiPrivadaSelected = false;
  planMovilSelected = false;
  planFijoSelected = false;

  // success message
  successMessage = 'Coworker editado con éxito';

  // error message
  errorMessage = 'Ocurrió un eror creando al coworker';

  // current coworker
  coworker: Coworker;

  // current plan
  plan: Plan;

  // current group
  grupo: Grupo;

  // current users_puestos
  usersPuestos: UsersPuestos;

  // is leader flag
  isLeader = false;

  // changed flags
  coworkerChanged = false;
  planChanged = false;
  userPuestoChanged = false;

  selectedDays = [true, true, true, true, true, false];

  constructor(
    public dialogRef: MatDialogRef<EditCoworkerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cowortersService: CoworkersService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    // for show the spinner
    this.loading = true;

    // loads the form
    this.editCoworkersForm = new FormGroup({
      nombre: new FormControl({ value: '' }, [Validators.required]),
      apellido: new FormControl({ value: '' }, [Validators.required]),
      email: new FormControl({ value: '' }, [Validators.required]),
      plan: new FormControl({ value: '' }, [Validators.required]),
      dni: new FormControl({ value: '' }, [Validators.required]),
      celular: new FormControl({ value: '' }, [Validators.required]),
      direccion: new FormControl({ value: '' }, [Validators.required]),
      fecha_nacimiento: new FormControl({ value: '' }, [Validators.required]),
      grupo: new FormControl({ value: '' }),
      rol: new FormControl({ value: '' }),
      hora_desde: new FormControl({ value: '' }),
      hora_hasta: new FormControl({ value: '' }),
      fecha_desde: new FormControl({ value: '' }),
      fecha_hasta: new FormControl({ value: '' }),
      horas_sala: new FormControl({ value: '' }, [Validators.required]),
    });

    // get user, puesto, plan and grupo by user id
    this.cowortersService.getCoworkerById(this.data.id).subscribe((result) => {

      if (!result.success) {
        console.log('ocurrio un error');
        console.log(result.msg);
      }

      // loads result data
      this.coworker = result.coworker;
      this.usersPuestos = result.userPuesto;
      this.usersPuestos.dias = [
        result.userPuesto.lunes,
        result.userPuesto.martes,
        result.userPuesto.miercoles,
        result.userPuesto.jueves,
        result.userPuesto.viernes,
        result.userPuesto.sabado
      ];
      this.plan = result.plan;
      this.grupos = result.groups;

      // time data type for user puesto
      if (this.usersPuestos) {
        if (this.usersPuestos.hora_desde) {
          this.usersPuestos.hora_desde = {
            hours: result.userPuesto.hora_desde.split(':')[0],
            minutes: result.userPuesto.hora_desde.split(':')[1]
          };

          this.editCoworkersForm.controls.hora_desde.setValue(
            this.usersPuestos.hora_desde.hours + ':' + this.usersPuestos.hora_desde.minutes
          );
        }

        if (this.usersPuestos.hora_hasta) {
          this.usersPuestos.hora_hasta = {
            hours: result.userPuesto.hora_hasta.split(':')[0],
            minutes: result.userPuesto.hora_hasta.split(':')[1]
          };
          this.editCoworkersForm.controls.hora_hasta.setValue(
            this.usersPuestos.hora_hasta.hours + ':' + this.usersPuestos.hora_hasta.minutes
          );
        }


        // sets fecha_desde & fecha_hasta
        this.editCoworkersForm.controls.fecha_desde.setValue(this.usersPuestos.fecha_desde);
        this.editCoworkersForm.controls.fecha_hasta.setValue(this.usersPuestos.fecha_hasta);

        this.selectedDays = [...this.usersPuestos.dias];
      }


      // sets personal data
      this.editCoworkersForm.controls.nombre.setValue(this.coworker.nombre);
      this.editCoworkersForm.controls.apellido.setValue(this.coworker.apellido);
      this.editCoworkersForm.controls.email.setValue(this.coworker.email);
      this.editCoworkersForm.controls.dni.setValue(this.coworker.dni);
      this.editCoworkersForm.controls.direccion.setValue(this.coworker.direccion);
      this.editCoworkersForm.controls.celular.setValue(this.coworker.celular);
      this.editCoworkersForm.controls.fecha_nacimiento.setValue(this.coworker.fecha_nacimiento);

      // sets plan to static array
      if (this.plan.is_custom) {
        // plan 5 represents the personalizado plan
        this.editCoworkersForm.controls.plan.setValue(5);
        this.onPlanSelected(5);
      } else {
        this.editCoworkersForm.controls.plan.setValue(this.plan.id);
        this.onPlanSelected(this.plan.id);
      }



      // sets horas_sala
      this.editCoworkersForm.controls.horas_sala.setValue(this.plan.horas_sala);

      if (this.coworker.id_grupo) {

        this.grupo = this.grupos.find(g => g.id === this.coworker.id_grupo);

        // sets group
        this.editCoworkersForm.controls.grupo.setValue(this.grupo.id);

        this.grupos.push({ id: 0, id_lider: null, nombre: 'Sin grupo', horas_sala: 0, cuit_cuil: '' });

        // sets role
        if (this.grupo.id_lider === this.coworker.id) {
          this.isLeader = true;
          this.editCoworkersForm.controls.rol.setValue('leader');
        } else {
          this.editCoworkersForm.controls.rol.setValue('member');
        }

      } else {
        this.editCoworkersForm.controls.grupo.setValue(null);
      }

      this.loading = false;
    });

  }

  onGroupSelected(value): void {
    if (value === 0) {
      this.editCoworkersForm.controls.rol.setValue(null);
    }
  }

  // Function performed when the user selects some value in Plans mat select
  // chagens the UI based on the actual selection.
  onPlanSelected(value): void {

    switch (value) {
      case 1: {
        this.editCoworkersForm.controls.horas_sala.setValue(2);
        this.editCoworkersForm.controls.horas_sala.disable();
        this.planMovilSelected = true;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = false;
        break;
      }
      case 2: {
        this.editCoworkersForm.controls.horas_sala.setValue(4);
        this.editCoworkersForm.controls.horas_sala.disable();
        this.planMovilSelected = true;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = true;
        this.editCoworkersForm.controls.hora_desde.setValue('08:00');
        this.editCoworkersForm.controls.hora_hasta.setValue('20:00');
        break;
      }
      case 3: {
        this.editCoworkersForm.controls.horas_sala.setValue(4);
        this.editCoworkersForm.controls.horas_sala.disable();
        this.planMovilSelected = false;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = true;
        this.editCoworkersForm.controls.hora_desde.setValue('08:00');
        this.editCoworkersForm.controls.hora_hasta.setValue('20:00');
        break;
      }
      case 4: {
        this.editCoworkersForm.controls.horas_sala.setValue(4);
        this.editCoworkersForm.controls.horas_sala.enable();
        this.planMovilSelected = false;
        this.planOfiPrivadaSelected = true;
        this.planFijoSelected = true;
        break;
      }
      case 5: {
        this.editCoworkersForm.controls.horas_sala.setValue(4);
        this.editCoworkersForm.controls.horas_sala.enable();
        this.planMovilSelected = true;
        this.planOfiPrivadaSelected = false;
        this.planFijoSelected = false;
        break;
      }
      default: {
        this.planOfiPrivadaSelected = false;
        break;
      }
    }
  }

  // handles the checkbox press event
  onCheckboxPressed(index: number): void {
    this.selectedDays[index] = !this.selectedDays[index];
  }

  // closes the dialog
  close(): void {
    this.dialogRef.close(false);
  }

  // checks if the fields are changed and updates just the data changed
  submit(): void {

    if (this.editCoworkersForm.valid) {
      // shows spinner
      this.loadingSubmit = true;

      // falgs to detect changes in coworker
      const nombreChanged = this.editCoworkersForm.controls.nombre.value !== this.coworker.nombre;
      const apellidoChanged = this.editCoworkersForm.controls.apellido.value !== this.coworker.apellido;
      const emailChanged = this.editCoworkersForm.controls.email.value !== this.coworker.email;
      const dniChanged = this.editCoworkersForm.controls.dni.value !== this.coworker.dni;
      const direccionChanged = this.editCoworkersForm.controls.direccion.value !== this.coworker.direccion;
      const celularChanged = this.editCoworkersForm.controls.celular.value !== this.coworker.celular;
      const fechaNacimientoChanged = this.editCoworkersForm.controls.fecha_nacimiento.value !== this.coworker.fecha_nacimiento;

      // if the user already has group and the initial group is different than the actual: group has changed
      // if the user does not have group and the actual group is different than null: group has changed
      const groupChanged = (this.grupo && this.editCoworkersForm.controls.grupo.value !== this.grupo.id) ||
        (!this.grupo && this.editCoworkersForm.controls.grupo.value !== null);

      // isLeader flag indicates if the user loaded was a leader
      const rolChanged = (!this.isLeader && this.editCoworkersForm.value.rol === 'leader') ||
        (this.isLeader && this.editCoworkersForm.value.rol === 'member');

      this.coworkerChanged = nombreChanged || apellidoChanged || emailChanged || dniChanged ||
        direccionChanged || celularChanged || fechaNacimientoChanged || groupChanged || rolChanged;

      // flags to detect changes in plan
      const planChanged = this.editCoworkersForm.controls.plan.value !== this.plan.id;
      const hotasSalaChanged = this.editCoworkersForm.controls.horas_sala.value !== this.plan.horas_sala;
      this.planChanged = planChanged || hotasSalaChanged;

      // flags to detect changes in users_puestos
      const horaDesdeChanged = this.editCoworkersForm.controls.hora_desde.value !==
        (this.usersPuestos.hora_desde.hours + ':' + this.usersPuestos.hora_desde.minutes);
      const horaHastaChanged = this.editCoworkersForm.controls.hora_hasta.value !==
        (this.usersPuestos.hora_hasta.hours + ':' + this.usersPuestos.hora_hasta.minutes);

      const fechaDesdeChanged = this.editCoworkersForm.controls.fecha_desde.value !== this.usersPuestos.fecha_desde;
      const fechaHastaChanged = this.editCoworkersForm.controls.fecha_hasta.value !== this.usersPuestos.fecha_hasta;
      const daysChaged = this.usersPuestos.dias !== this.selectedDays;
      this.userPuestoChanged = horaDesdeChanged || horaHastaChanged || fechaDesdeChanged || fechaHastaChanged || daysChaged;

      let coworker: Coworker;
      if (this.coworkerChanged) {
        // we instantiate the coworker class
        console.log('coworker changed');
        coworker = {
          id: this.coworker.id,
          nombre: this.editCoworkersForm.value.nombre,
          apellido: this.editCoworkersForm.value.apellido,
          email: this.editCoworkersForm.value.email,
          horas_sala: this.coworker.horas_sala,
          horas_sala_consumidas: 0,
          is_coworker: true,
          dni: this.editCoworkersForm.value.dni,
          fecha_nacimiento: this.editCoworkersForm.value.fecha_nacimiento,
          direccion: this.editCoworkersForm.value.direccion,
          celular: this.editCoworkersForm.value.celular,
          id_plan: this.coworker.id_plan,
          id_grupo: this.editCoworkersForm.value.grupo,
          is_leader: this.editCoworkersForm.value.rol === 'leader',
        };
      }

      let plan: Plan;
      if (this.planChanged) {
        // if the user changed the horas_sala parameter it's a custom plan
        // we take the planes from a harcoded structure, probably in the future we would get this from backend
        let selectedPlan = PLANES[this.editCoworkersForm.value.plan - 1];
        if (!selectedPlan) {
          selectedPlan = this.plan;
        }

        selectedPlan.horas_sala = this.editCoworkersForm.controls.horas_sala.value;
        selectedPlan.is_custom = selectedPlan.id === 5;
        plan = selectedPlan;
      }


      let usersPuestos: UsersPuestos;
      if (this.userPuestoChanged) {
        // Users puestos instance
        usersPuestos = {
          id_user: this.coworker.id,
          hora_desde: {
            hours: this.editCoworkersForm.value.hora_desde.split(':')[0],
            minutes: this.editCoworkersForm.value.hora_desde.split(':')[1]
          },
          hora_hasta: {
            hours: this.editCoworkersForm.value.hora_hasta.split(':')[0],
            minutes: this.editCoworkersForm.value.hora_hasta.split(':')[1]
          },
          fecha_desde: this.editCoworkersForm.value.fecha_desde,
          fecha_hasta: this.editCoworkersForm.value.fecha_hasta,
          dias: this.selectedDays
        };
      }

      this.cowortersService.updateCoworker(this.coworker.id, coworker, usersPuestos, plan).subscribe((response) => {
        if (response.success) {
          this.onSuccess();
        } else {
          this.onError(response.error);
        }
      },
        (err) => this.onError(err));
    }
  }

  onError(err): void {
    this.loadingSubmit = false;
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
