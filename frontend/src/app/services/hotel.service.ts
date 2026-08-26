import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from './room.service';

export interface Hotel {
  id?: number;
  name: string;
  cityId?: number;
  cityName?: string;
  city?: string;
  chain?: string;
  rating?: number;
  address?: string;
  email?: string;
  imageUrl?: string;
  description?: string;
  checkIn?: string;
  checkOut?: string;
  hotelChainId?: number;
  hotelChainName?: string;
  isActive?: boolean;  // ✅ Remove the '?', make it required
  rooms?: Room[];
  hotelAmenities?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:8082/api/hotels';

  constructor(private http: HttpClient) {}

  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  getActiveHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/active`);
  }

  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }

  createHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(this.apiUrl, hotel);
  }

  updateHotel(id: number, hotel: Hotel): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.apiUrl}/${id}`, hotel);
  }

  deleteHotel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateHotel(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateHotel(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deactivate`, {});
  }

  // Add to your existing HotelService
  getHotelsByCity(cityId: number): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/city/${cityId}`);
  }

  getHotelsByCityName(cityName: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/city/name/${cityName}`);
  }

  getHotelsByChain(chain: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/chain/${chain}`);
  }

  getHotelsByRating(rating: number): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/rating/${rating}`);
  }

  searchHotels(keyword: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }

  getAllChains(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/chains`);
  }
}
