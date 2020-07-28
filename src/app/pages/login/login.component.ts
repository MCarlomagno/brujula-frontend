import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  email = '';
  password = '';

  // shows spinner
  isLoading = false;

  // shows error msg
  failed = false;

  // error message on login failed
  errorMsg = 'Usuario o contraseña inválidos, por favor intentá de nuevo.';

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {

  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: new FormControl(this.email, [Validators.required]),
      password: new FormControl(this.password, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.createForm();
  }

  // handles any input change event to hide the error msg
  onInputChange(): void {
    this.failed = false;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {

      // shows spinner
      this.isLoading = true;

      const user = { email: this.loginForm.value.email, password: this.loginForm.value.password };
      this.authService.signIn(user).subscribe((result) => {

        // hides spinner
        this.isLoading = false;

        // sets user token in local storage
        localStorage.setItem('token', result.token);
        this.router.navigate(['dashboard']);
      },
        (error) => {
          // hides spinner and shows error msg
          this.isLoading = false;
          this.failed = true;
        });
    }
  }

}
