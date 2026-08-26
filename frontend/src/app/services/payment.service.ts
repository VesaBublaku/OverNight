import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  id?: number;
  transactionId?: string;
  reservationId?: number;
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
        name?: string;
      };
    };
  };
  customerId?: number;
  customerName?: string;
  customerEmail?: string;
  hotel?: string;
  roomNumber?: string;
  amount: number;
  method: string; // 'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer' | 'Online Payment'
  status: string; // 'completed' | 'pending' | 'failed' | 'refunded'
  paymentDate?: string;
  paymentTime?: string;
  cardNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8082/api/payments';

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  getPaymentByTransactionId(transactionId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/transaction/${transactionId}`);
  }

  getPaymentByReservationId(reservationId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/reservation/${reservationId}`);
  }

  getPaymentsByUser(userId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/user/${userId}`);
  }

  getPaymentsByStatus(status: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/status/${status}`);
  }

  getPaymentsByMethod(method: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/method/${method}`);
  }

  getRevenueStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/revenue`);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(id: number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, payment);
  }

  completePayment(id: number): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}/complete`, {});
  }

  failPayment(id: number): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}/fail`, {});
  }

  refundPayment(id: number): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}/refund`, {});
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
