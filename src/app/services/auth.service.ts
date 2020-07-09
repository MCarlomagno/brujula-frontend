import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  signIn(user: any): Observable<any> {
    console.log('enta a sign in');
    return this.http.post(this.url + '/users/login', user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
