import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupManagementService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  getCoworkers(
    filter = '',
    group = null,
    plan = null,
    bornDate = null,
    sortOrder = 'asc',
    pageNumber = 1,
    pageSize = 10): Observable<any> {

    return this.http.get<any>(this.url + '/myGroupCoworkers', {
      params: new HttpParams().set('filter', filter)
        .set('bornDate', bornDate)
        .set('plan', plan)
        .set('group', group)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    });
  }
}
