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
  isLoading = false;

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

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const user = { email: this.loginForm.value.email, password: this.loginForm.value.password };
      this.authService.signIn(user).subscribe((result) => {
        this.isLoading = false;
        localStorage.setItem('token', result.token);
        this.router.navigate(['dashboard']);
      },
        (error) => {
          console.log('error');
          console.log(error);
          this.isLoading = false;
        });
    }
  }

}
