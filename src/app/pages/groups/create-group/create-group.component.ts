import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsService } from 'src/app/services/groups.service';
import { OficinasService } from 'src/app/services/oficinas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Grupo } from 'src/app/models/group.model';
import { Oficina } from 'src/app/models/oficina.model';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  // Initial loading
  loading = false;

  // Submit loading
  loadingSubmit = false;

  // create group form group
  createGroupForm: FormGroup;

  // success message
  successMessage = 'Grupo creado con éxito';

  // error message
  errorMessage = 'Ocurrió un eror creando al Grupo';

  // oficinas
  oficinas: Oficina[];

  constructor(
    public dialogRef: MatDialogRef<CreateGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupsService: GroupsService,
    private oficinasService: OficinasService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    // for show the spinner
    this.loading = true;

    // loads the form
    this.createGroupForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      cuit_cuil: new FormControl('', [Validators.required]),
      oficina: new FormControl(''),
    });

    // load offices
    this.oficinasService.getOficinas().subscribe((result: Oficina[]) => {
      this.oficinas = result;

      // hides the spinner
      this.loading = false;
    });

  }

  // closes the dialog
  close(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    if (this.createGroupForm.valid) {
      this.loadingSubmit = true;
      const createdGroup: Grupo = {
        nombre: this.createGroupForm.controls.nombre.value,
        cuit_cuil: this.createGroupForm.controls.cuit_cuil.value,
        id_oficina: this.createGroupForm.controls.oficina.value
      };

      this.groupsService.createGroup(createdGroup).subscribe((response) => {
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
