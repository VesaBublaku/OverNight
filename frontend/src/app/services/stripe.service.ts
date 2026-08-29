// stripe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = 'http://localhost:8082/api/payments';

  constructor(private http: HttpClient) {}

  createPaymentIntent(reservationId: number, amount: number, currency: string = 'usd'): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-intent`, {
      reservationId,
      amount,
      currency
    });
  }

  // ✅ Fixed: Pass reservationId in request body
  confirmPayment(paymentIntentId: string, reservationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm/${paymentIntentId}`, {
      reservationId: reservationId
    });
  }

  getPaymentStatus(paymentIntentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${paymentIntentId}`);
  }
}
