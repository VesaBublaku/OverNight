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
  amenities?: string | string[];
  hotel?: {
    id: number;
    name?: string;
    cityName?: string;
    city?: string;
    imageUrl?: string;
  };
  hotelName?: string;
  hotelCity?: string;
  roomTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`);
  }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`);
  }

  getActiveRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms/active`);
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/rooms/${id}`);
  }

  getRoomsByHotel(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms/hotel/${hotelId}`);
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/rooms`, room);
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/rooms/${id}`, room);
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rooms/${id}`);
  }

  activateRoom(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/rooms/${id}/activate`, {});
  }

  deactivateRoom(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/rooms/${id}/deactivate`, {});
  }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cities`);
  }

  searchRooms(params: any): Observable<Room[]> {
    const cleanParams: any = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return this.http.get<Room[]>(`${this.apiUrl}/rooms/search`, { params: cleanParams });
  }
}
