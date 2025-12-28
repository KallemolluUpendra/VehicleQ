import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service';
import { AuthService } from '../../services/auth.service';
import { Vehicle } from '../../models/vehicle.model';
import { App as CapacitorApp } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-vehicle-list',
  imports: [CommonModule],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css'
})
export class VehicleListComponent implements OnInit, OnDestroy {
  selectedVehicle: Vehicle | null = null;
  selectedIndex = 0;
  private backButtonListener?: PluginListenerHandle;

  constructor(
    public vehicleService: VehicleService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.vehicleService.loadUserVehicles(currentUser.id);
    }

    // Handle back button for lightbox
    this.backButtonListener = await CapacitorApp.addListener('backButton', () => {
      if (this.selectedVehicle) {
        // If lightbox is open, close it instead of going back
        this.closeLightbox();
      }
      // If lightbox is not open, let the parent component handle it
    });
  }

  ngOnDestroy(): void {
    if (this.backButtonListener) {
      this.backButtonListener.remove();
    }
  }

  getImageUrl(vehicleId: number): string {
    return this.vehicleService.getImageUrl(vehicleId);
  }

  openLightbox(vehicle: Vehicle, index: number): void {
    this.selectedVehicle = vehicle;
    this.selectedIndex = index;
  }

  closeLightbox(): void {
    this.selectedVehicle = null;
  }

  refresh(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.vehicleService.loadUserVehicles(currentUser.id);
    }
  }
}
