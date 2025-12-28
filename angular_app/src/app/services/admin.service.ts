import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

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
  private apiUrl = 'https://vehicleq-dev.onrender.com';  // Production URL
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

  async downloadExportAsJson(data: ExportData): Promise<void> {
    if (!this.isBrowser) return;
    
    const jsonString = JSON.stringify(data, null, 2);
    const fileName = `vehicleq-export-${new Date().toISOString().split('T')[0]}.json`;
    
    // Check if running on native platform (Android/iOS)
    if (Capacitor.isNativePlatform()) {
      // On modern Android (targetSdk 30+), writing directly to public Downloads using
      // file paths often fails due to scoped storage (even if permissions are granted).
      // Instead, write to app-owned storage and let the user choose where to save via Share.
      try {
        // 1) Write to app-owned Documents (fallback to Data)
        let directory: Directory = Directory.Documents;
        try {
          await Filesystem.writeFile({
            path: fileName,
            data: jsonString,
            directory,
            encoding: Encoding.UTF8,
          });
        } catch {
          directory = Directory.Data;
          await Filesystem.writeFile({
            path: fileName,
            data: jsonString,
            directory,
            encoding: Encoding.UTF8,
          });
        }

        // 2) Get a URI and open the system share/save sheet
        const uriResult = await Filesystem.getUri({ path: fileName, directory });
        await Share.share({
          title: 'VehicleQ Export',
          text: `VehicleQ export file: ${fileName}`,
          url: uriResult.uri,
          dialogTitle: 'Save VehicleQ export',
        });
      } catch (error: any) {
        console.error('Export error:', error);
        alert(
          `Failed to export file: ${error?.message || error || 'Unknown error'}\n\n` +
            `Tip: Choose a destination from the Save/Share dialog (Files, Drive, etc).`
        );
      }
    } else {
      // Web browser download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
