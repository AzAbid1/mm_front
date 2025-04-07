import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface UpdateUserPayload {
  firstName: string;
  lastName: string;
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  updateUserDetails(userId: string, payload: UpdateUserPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${userId}`, payload);
  }

  changePassword(userId: string, payload: ChangePasswordPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${userId}/change-password`, payload);
  }

  initiateGoogleAuth(): void {
    window.location.href = `${this.baseUrl}/auth/google`;
  }
}
