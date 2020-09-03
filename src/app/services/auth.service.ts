import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.url;

  constructor(private http: HttpClient, private router: Router) { }

  signIn(user: any): Observable<any> {
    return this.http.post(this.url + '/users/login', user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getUserId(): any {
    const helper = new JwtHelperService();
    const token = this.getToken();
    const decodedToken = helper.decodeToken(token);
    return decodedToken.id;
  }

  restorePass(email: string): Observable<any> {
    const body = {};
    console.log(email);
    return this.http.post(this.url + `/users/forgotPassword/${email}`, body);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
