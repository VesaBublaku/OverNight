import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HotelChain {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
  hotelCount?: number;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HotelChainService {
  private apiUrl = 'http://localhost:8082/api/hotel-chains';

  constructor(private http: HttpClient) {}

  getAllHotelChains(): Observable<HotelChain[]> {
    return this.http.get<HotelChain[]>(this.apiUrl);
  }

  getActiveHotelChains(): Observable<HotelChain[]> {
    return this.http.get<HotelChain[]>(`${this.apiUrl}/active`);
  }

  getHotelChainById(id: number): Observable<HotelChain> {
    return this.http.get<HotelChain>(`${this.apiUrl}/${id}`);
  }

  getHotelChainByName(name: string): Observable<HotelChain> {
    return this.http.get<HotelChain>(`${this.apiUrl}/name/${name}`);
  }

  createHotelChain(chain: HotelChain): Observable<HotelChain> {
    return this.http.post<HotelChain>(this.apiUrl, chain);
  }

  updateHotelChain(id: number, chain: HotelChain): Observable<HotelChain> {
    return this.http.put<HotelChain>(`${this.apiUrl}/${id}`, chain);
  }

  deleteHotelChain(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateHotelChain(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateHotelChain(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deactivate`, {});
  }

  searchHotelChains(keyword: string): Observable<HotelChain[]> {
    return this.http.get<HotelChain[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }

  getTotalChains(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/count`);
  }
}
