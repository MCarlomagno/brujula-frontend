import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  restorePassword: FormGroup;

  loadingSubmit = false;

  errorMessage = 'Ocurrió un error enviando el email';

  successMessage = 'Se envió el email con tu nueva contraseña';

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private snackBar: MatSnackBar,
    private authService: AuthService) { }

  ngOnInit(): void {
    // loads the form
    this.restorePassword = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });

  }


  submit(): void {
    if (this.restorePassword.valid) {
      this.loadingSubmit = true;

      const email = this.restorePassword.controls.email.value;

      this.authService.restorePass(email).subscribe((response) => {
        if (!response.success) {
          this.onError(response.error);
        } else {
          this.onSuccess();
        }

      },
        (err) => this.onError(err));

    }
  }

  close(): void {
    this.dialogRef.close();
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
    this.snackBar.open(this.successMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }
}
