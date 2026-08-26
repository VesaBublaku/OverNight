import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id?: number;
  reservationNumber?: string;
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
  } | null;
  room?: {
    id: number;
    roomNumber?: string;
    price?: number;
    hotel?: {
      id: number;
      name: string;
      city: string;
    };
  } | null;
  checkInDate?: string;
  checkOutDate?: string;
  nights?: number;
  guests?: number;
  totalPrice?: number;
  specialRequests?: string;
  status?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8082/api/reservations';

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUpcomingReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/upcoming`);
  }

  getPastReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/past`);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }

  checkIn(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/check-in`, {});
  }

  checkOut(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/check-out`, {});
  }
}
