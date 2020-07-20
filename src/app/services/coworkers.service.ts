import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Coworker } from '../models/coworker.model';
import { Observable } from 'rxjs';
import { UsersPuestos } from '../models/users-puestos.model';

@Injectable({
  providedIn: 'root'
})
export class CoworkersService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  getCoworkers(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 10): Observable<Coworker[]> {
    return this.http.get<Coworker[]>(this.url + '/coworkers', {
      params: new HttpParams().set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    });
  }

  createCoworker(coworker: Coworker, usersPuestos?: UsersPuestos): Observable<any> {
    const body = {
      coworker,
      usersPuestos,
    };
    return this.http.post<any>(this.url + '/coworkers', body);
  }

}
