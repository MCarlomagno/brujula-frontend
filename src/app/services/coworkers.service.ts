import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Coworker } from '../models/coworker.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoworkersService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  getCoworkers(): Observable<Coworker[]> {
    return this.http.get<Coworker[]>(this.url + '/coworkers');
  }

}
