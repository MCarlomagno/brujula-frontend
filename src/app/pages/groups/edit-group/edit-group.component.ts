import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsService } from 'src/app/services/groups.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Grupo } from 'src/app/models/group.model';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  // actual group
  group: Grupo;

  // Initial loading
  loading = false;

  // Submit loading
  loadingSubmit = false;

  // create group form group
  createGroupForm: FormGroup;

  // success message
  successMessage = 'Grupo editado con éxito';

  // error message
  errorMessage = 'Ocurrió un eror editando al Grupo';

  constructor(
    public dialogRef: MatDialogRef<EditGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupsService: GroupsService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    // for show the spinner
    this.loading = true;

    this.createGroupForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      cuit_cuil: new FormControl('', [Validators.required]),
    });

    this.groupsService.getGroupById(this.data.id).subscribe((grupo) => {
      this.group = grupo;

      // loads the form
      this.createGroupForm.controls.nombre.setValue(this.group.nombre);
      this.createGroupForm.controls.cuit_cuil.setValue(this.group.cuit_cuil);

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

      // shows spinner
      this.loadingSubmit = true;

      const editedGroup: Grupo = {
        nombre: this.createGroupForm.controls.nombre.value,
        cuit_cuil: this.createGroupForm.controls.cuit_cuil.value
      };

      this.groupsService.editGroup(editedGroup, this.data.id).subscribe((response) => {
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
    // hides spinner
    this.loadingSubmit = false;
    console.log(err);
    this.snackBar.open(this.errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }

  onSuccess(): void {
    // hides spinner
    this.loadingSubmit = false;
    this.dialogRef.close(true);
    this.snackBar.open(this.successMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }
}
