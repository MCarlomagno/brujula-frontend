import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Oficina } from '../models/oficina.model';

@Injectable({
  providedIn: 'root'
})
export class OficinasService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  getOficinas(): Observable<Oficina[]> {
    return this.http.get<Oficina[]>(this.url + '/oficinas');
  }
}
