import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  id?: number;
  roomNumber?: string;
  number?: string;
  price?: number;
  capacity?: number;
  isExtendable?: boolean;
  extendable?: boolean;
  conditionNote?: string;
  condition?: string;
  imageUrl?: string;
  isActive?: boolean;
  hotelId?: number;
  roomTypeId?: number;
  roomType?: any;
  roomAmenityIds?: number[];
  roomAmenities?: any[];
  roomTypeName?: string;
  amenities?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8082/api/rooms';

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getActiveRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/active`);
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  getRoomsByHotel(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateRoom(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateRoom(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deactivate`, {});
  }
}
