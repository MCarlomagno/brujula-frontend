import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Grupo } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  getGroups(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.url + '/groups');
  }
}
