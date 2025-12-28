import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Production URL
  private baseUrl = 'https://vehicleq.onrender.com';

  constructor(private http: HttpClient) { }

  // User Registration
  registerUser(username: string, email: string, password: string, fullName: string, phone: string): Observable<User> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('full_name', fullName);
    formData.append('phone', phone);

    return this.http.post<User>(`${this.baseUrl}/register/`, formData);
  }

  // User Login
  loginUser(username: string, password: string): Observable<User> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<User>(`${this.baseUrl}/login/`, formData);
  }

  // Get User Profile
  getUserProfile(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile/${userId}`);
  }

  // Update User Profile
  updateProfile(userId: number, fullName: string, phone: string): Observable<User> {
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('phone', phone);

    return this.http.put<User>(`${this.baseUrl}/profile/${userId}`, formData);
  }

  // Get All Vehicles
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles/`);
  }

  // Get User's Vehicles
  getUserVehicles(userId: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles/${userId}`);
  }

  // Upload Vehicle
  uploadVehicle(userId: number, vehicleNumber: string, owner: string, imageFile: File): Observable<Vehicle> {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('number', vehicleNumber);
    formData.append('owner', owner);
    formData.append('image', imageFile);

    return this.http.post<Vehicle>(`${this.baseUrl}/upload/`, formData);
  }

  // Delete Vehicle
  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vehicle/${vehicleId}`);
  }

  // Get Image URL
  getImageUrl(vehicleId: number): string {
    return `${this.baseUrl}/image/${vehicleId}`;
  }
}
