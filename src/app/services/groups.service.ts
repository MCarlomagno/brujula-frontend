import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Grupo } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  // gets the number of groups
  getGroupsCount(): Observable<any> {
    return this.http.get<any>(this.url + '/groups/count');
  }

  // gets group by id
  getGroupById(id: number): Observable<any> {
    return this.http.get<any>(this.url + '/groups/getById/' + id);
  }

  getGroups(filter = '', sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.url + '/groups', {
      params: new HttpParams().set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    });
  }

  getAllGroups(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.url + '/groups/getAll');
  }

  getAllGroupsAndPuestos(): Observable<any> {
    return this.http.get<any>(this.url + '/corowkers/allGroupsAndPuestos');
  }

  createGroup(group: Grupo): Observable<any> {
    const body = {
      group,
    };
    return this.http.post<any>(this.url + '/groups', body);
  }

  editGroup(group: Grupo, id: number): Observable<any> {
    const body = {
      group,
    };
    return this.http.put<any>(this.url + '/groups/' + id, body);
  }

  deleteGroup(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/groups/' + id);
  }
}
