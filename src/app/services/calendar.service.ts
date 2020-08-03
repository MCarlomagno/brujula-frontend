import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Sala } from '../models/sala.model';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private url = environment.url;

  constructor(private http: HttpClient) { }

  createReservation(reservation: Reservation): Observable<any> {
    const body = {
      reservation,
    };
    return this.http.post<any>(this.url + '/reservation', body);
  }

}
