import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Staff {
  id?: number;
  email: string;
  password?: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = 'http://localhost:8082/api/staff';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData = {
      email: email,
      password: password
    };
    console.log('📤 Staff login request:', loginData);
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('staff_token', response.token);
          localStorage.setItem('staff_data', JSON.stringify(response.staff));
          localStorage.setItem('overnight_role', 'staff');
          localStorage.setItem('staff_name', response.staff.firstName + ' ' + response.staff.lastName);
          localStorage.setItem('staff_role', response.staff.role);
          localStorage.setItem('staff_email', response.staff.email);
          localStorage.setItem('isLoggedIn', 'true');
        }
      })
    );
  }

  register(staff: Staff): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, staff);
  }

  logout(): void {
    localStorage.removeItem('staff_token');
    localStorage.removeItem('staff_data');
    localStorage.removeItem('overnight_role');
    localStorage.removeItem('staff_name');
    localStorage.removeItem('staff_role');
    localStorage.removeItem('staff_email');
    localStorage.removeItem('isLoggedIn');
  }

  getCurrentStaff(): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/me`);
  }

  updateCurrentStaff(staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/me`, staff);
  }

  deleteCurrentStaff(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/me`);
  }

  updatePassword(newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/password`, { newPassword });
  }

  getAllStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl);
  }

  getStaffById(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/${id}`);
  }

  updateStaff(id: number, staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, staff);
  }

  deleteStaff(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateStaff(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateStaff(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deactivate`, {});
  }

  getStaffByRole(role: string): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}/role/${role}`);
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/exists/${email}`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('staff_token');
  }

  getToken(): string | null {
    return localStorage.getItem('staff_token');
  }

  getStaffName(): string {
    return localStorage.getItem('staff_name') || 'Staff';
  }

  getStaffRole(): string {
    return localStorage.getItem('staff_role') || 'Staff';
  }
}
