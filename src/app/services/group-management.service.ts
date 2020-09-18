import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Coworker } from '../models/coworker.model';

@Injectable({
  providedIn: 'root'
})
export class GroupManagementService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  getGroupCoworkers(
    filter = '',
    userId: number,
    plan = null,
    bornDate = null,
    sortOrder = 'asc',
    pageNumber = 1,
    pageSize = 10): Observable<any> {

    return this.http.get<any>(this.url + `/myGroupCoworkers/${userId}`, {
      params: new HttpParams().set('filter', filter)
        .set('bornDate', bornDate)
        .set('plan', plan)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    });
  }

  saveCoworkerHours(coworkers: Coworker[]): Observable<any>  {
    const body = {
      coworkers
    };
    return this.http.put<any>(this.url + `/updateCoworkerHours`, body);
  }
}
