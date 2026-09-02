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
  private apiUrl = 'http://localhost:8082/api/reservations';

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  getUserReservations(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUpcomingReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}/upcoming`);
  }

  getPastReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}/past`);
  }

  getReservationsByRoom(roomId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/room/${roomId}`);
  }

  getReservationsByStatus(status: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/status/${status}`);
  }

  getUpcomingReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/upcoming`);
  }

  getPastReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/past`);
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  cancelReservation(id: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/cancel`, {});
  }

  checkIn(id: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/check-in`, {});
  }

  checkOut(id: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/check-out`, {});
  }

  updateStatus(id: number, status: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/status`, { status });
  }

  completeReservation(id: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/complete`, {});
  }

  confirmReservation(id: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/confirm`, {});
  }

  checkAvailability(roomId: number, checkIn: string, checkOut: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-availability`, {
      params: { roomId, checkIn, checkOut }
    });
  }

  getUnavailableDates(roomId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/unavailable-dates/${roomId}`);
  }

  getRevenueStats(): Observable<{ totalRevenue: number }> {
    return this.http.get<{ totalRevenue: number }>(`${this.apiUrl}/stats/revenue`);
  }
}
