import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getRoomsReservations(currentStart: Date, currentEnd: Date, salaId?: number): Observable<any>  {
    return this.http.get<any>(this.url + '/reservation/byWeek', {
      params: new HttpParams()
        .set('idSala', salaId ? salaId.toString() : '')
        .set('dateFrom', currentStart.toISOString())
        .set('dateTo', currentEnd.toISOString())
    });
  }

}
