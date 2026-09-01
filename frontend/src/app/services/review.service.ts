import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt?: string;
  guestName?: string;
  guestEmail?: String;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8082/api/reviews';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Make sure this is where your token is stored!
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  createReview(reservationId: number, review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reservation/${reservationId}`, review);
  }

  getReviewsByHotel(hotelId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
