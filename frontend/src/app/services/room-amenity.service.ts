import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoomAmenity {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RoomAmenityService {
  private apiUrl = 'http://localhost:8082/api/room-amenities';

  constructor(private http: HttpClient) {}

  getAllRoomAmenities(): Observable<RoomAmenity[]> {
    return this.http.get<RoomAmenity[]>(this.apiUrl);
  }

  getActiveRoomAmenities(): Observable<RoomAmenity[]> {
    return this.http.get<RoomAmenity[]>(`${this.apiUrl}/active`);
  }

  getRoomAmenityById(id: number): Observable<RoomAmenity> {
    return this.http.get<RoomAmenity>(`${this.apiUrl}/${id}`);
  }
}
