import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id?: number;
  reservationNumber?: string;
  userId?: number;
  roomId?: number;
  checkInDate?: string;
  checkOutDate?: string;
  nights?: number;
  guests?: number;
  totalPrice?: number;
  specialRequests?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
  room?: {
    id: number;
    roomNumber?: string;
    price?: number;
    capacity?: number;
    hotelId?: number;
    hotel?: {
      id: number;
      name?: string;
      cityName?: string;
    };
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  checkAvailability(roomId: number, checkIn: string, checkOut: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/reservations/check-availability`, {
      params: {
        roomId: roomId.toString(),
        checkIn: checkIn,
        checkOut: checkOut
      }
    });
  }

  getUnavailableDates(roomId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/reservations/unavailable-dates/${roomId}`);
  }

  createReservation(reservation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservations`, reservation);
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/reservations/${id}`);
  }

  updateReservation(id: number, reservation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservations/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reservations/${id}`);
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservations/${id}/cancel`, {});
  }

  confirmReservation(reservationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservations/${reservationId}/confirm`, {});
  }

  processPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments`, paymentData);
  }

  getUserReservations(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations/user/${userId}`);
  }
}
