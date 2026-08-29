import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  id?: number;
  transactionId?: string;
  reservationId?: number;
  customerName?: string;
  customerEmail?: string;
  hotel?: string;
  roomNumber?: string;
  amount: number;
  method?: string;
  status?: string;
  paymentDate?: string;
  paymentTime?: string;
  cardNumber?: string;
  reservation?: {
    id: number;
    user?: {
      id: number;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    room?: {
      id: number;
      roomNumber?: string;
      hotel?: {
        id: number;
        name?: string;
      };
    };
  };
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8082/api/payments';

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}`);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  getPaymentsByUser(userId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/user/${userId}`);
  }

  getRevenueStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/revenue`);
  }

  completePayment(id: number): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}/complete`, {});
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}`, payment);
  }

  processHotelPayment(reservationId: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/hotel/${reservationId}`, {});
  }
}
