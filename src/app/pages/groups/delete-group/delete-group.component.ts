import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.scss']
})
export class DeleteGroupComponent implements OnInit {

  // shows spinner
  loadingConfirm = false;

  // user data
  id: number;
  name: string;

  // result messages
  errorMessage = 'Ocurrió un error eliminando al grupo.';
  successMessage = 'Grupo eliminado con éxito';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteGroupComponent>,
    private groupsService: GroupsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.id = this.data.id;
    this.name = this.data.name;
  }

  close(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.loadingConfirm = true;
    this.groupsService.deleteGroup(this.id).subscribe((response) => {
      console.log('vuelve con response');
      console.log(response);
      if (response.success) {
        this.onSuccess();
      } else {
        this.onError(response.error);
      }
    },
      (err) => this.onError(err)
    );
  }

  onError(err): void {
    this.loadingConfirm = false;
    console.log(err);
    if (err.error.error) {
      this.errorMessage = err.error.error;
    }
    this.snackBar.open(this.errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }

  onSuccess(): void {
    this.loadingConfirm = false;
    this.dialogRef.close(true);
    this.snackBar.open(this.successMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }

}
