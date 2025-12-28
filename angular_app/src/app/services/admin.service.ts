import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AdminVehicle {
  id: number;
  number: string;
  owner: string;
  timestamp: string;
  user_id: number;
  username: string;
  user_email: string;
}

export interface ExportData {
  export_date: string;
  users: any[];
  vehicles: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://vehicleq.onrender.com';  // Production URL
  private isAdminLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isAdminLoggedIn$ = this.isAdminLoggedInSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Check if admin is logged in from localStorage
    const adminToken = this.isBrowser ? localStorage.getItem('adminToken') : null;
    if (adminToken) {
      this.isAdminLoggedInSubject.next(true);
    }
  }

  adminLogin(username: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post(`${this.apiUrl}/admin/login/`, formData).pipe(
      tap(() => {
        // Store admin token
        if (this.isBrowser) {
          localStorage.setItem('adminToken', 'admin-authenticated');
        }
        this.isAdminLoggedInSubject.next(true);
      })
    );
  }

  adminLogout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('adminToken');
    }
    this.isAdminLoggedInSubject.next(false);
  }

  isAdminAuthenticated(): boolean {
    return this.isBrowser ? !!localStorage.getItem('adminToken') : false;
  }

  getAllVehicles(): Observable<AdminVehicle[]> {
    return this.http.get<AdminVehicle[]>(`${this.apiUrl}/admin/vehicles/`);
  }

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/vehicle/${vehicleId}`);
  }

  getVehicleImage(vehicleId: number): string {
    return `${this.apiUrl}/image/${vehicleId}`;
  }

  exportData(): Observable<ExportData> {
    return this.http.get<ExportData>(`${this.apiUrl}/admin/export/`);
  }

  importData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/import/`, data);
  }

  downloadExportAsJson(data: ExportData): void {
    if (!this.isBrowser) return;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vehicleq-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
