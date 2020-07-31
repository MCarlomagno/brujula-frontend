import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Coworker } from '../models/coworker.model';
import { Observable } from 'rxjs';
import { UsersPuestos } from '../models/users-puestos.model';
import { Plan } from '../models/plan.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CoworkersService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  getCoworkers(filter = '', sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<Coworker[]> {
    return this.http.get<Coworker[]>(this.url + '/coworkers', {
      params: new HttpParams().set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + '/users');
  }

  getCoworkerById(id: number): Observable<any> {
    return this.http.get<any>(this.url + '/coworkers/getById/' + id);
  }

  // gets the number of coworkers
  getCoworkersCount(): Observable<any> {
    return this.http.get<any>(this.url + '/coworkers/count');
  }

  createCoworker(coworker: Coworker, usersPuestos: UsersPuestos, selectedPlan: Plan): Observable<any> {
    const body = {
      coworker,
      usersPuestos,
      selectedPlan,
    };
    return this.http.post<any>(this.url + '/coworkers', body);
  }

  updateCoworker(id: number, coworker: Coworker, usersPuestos: UsersPuestos, selectedPlan: Plan): Observable<any> {
    const body = {
      coworker,
      usersPuestos,
      selectedPlan,
    };
    return this.http.put<any>(this.url + '/coworkers/' + id, body);
  }

  deleteCoworker(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/coworkers/' + id);
  }

}
