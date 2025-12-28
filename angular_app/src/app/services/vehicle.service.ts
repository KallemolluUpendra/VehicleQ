import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehiclesSubject = new BehaviorSubject<Vehicle[]>([]);
  public vehicles$ = this.vehiclesSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private apiService: ApiService) { }

  loadAllVehicles(): void {
    this.isLoadingSubject.next(true);
    this.apiService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehiclesSubject.next(vehicles);
        this.isLoadingSubject.next(false);
      },
      error: () => {
        this.isLoadingSubject.next(false);
      }
    });
  }

  loadUserVehicles(userId: number): void {
    this.isLoadingSubject.next(true);
    this.apiService.getUserVehicles(userId).subscribe({
      next: (vehicles) => {
        this.vehiclesSubject.next(vehicles);
        this.isLoadingSubject.next(false);
      },
      error: () => {
        this.isLoadingSubject.next(false);
      }
    });
  }

  uploadVehicle(userId: number, vehicleNumber: string, owner: string, imageFile: File): Observable<Vehicle> {
    return this.apiService.uploadVehicle(userId, vehicleNumber, owner, imageFile).pipe(
      tap((vehicle) => {
        const currentVehicles = this.vehiclesSubject.value;
        this.vehiclesSubject.next([vehicle, ...currentVehicles]);
      })
    );
  }

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.apiService.deleteVehicle(vehicleId).pipe(
      tap(() => {
        const currentVehicles = this.vehiclesSubject.value;
        this.vehiclesSubject.next(currentVehicles.filter(v => v.id !== vehicleId));
      })
    );
  }

  getImageUrl(vehicleId: number): string {
    return this.apiService.getImageUrl(vehicleId);
  }
}
