import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleListComponent } from '../vehicle-list/vehicle-list';
import { UploadVehicleComponent } from '../upload-vehicle/upload-vehicle';
import { ProfileComponent } from '../profile/profile';
import { App as CapacitorApp } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule, VehicleListComponent, UploadVehicleComponent, ProfileComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  currentTab = 0;
  private backButtonListener?: PluginListenerHandle;
  private lastBackPress = 0;
  private backPressInterval = 2000; // 2 seconds

  selectTab(index: number): void {
    this.currentTab = index;
  }

  async ngOnInit() {
    // Handle back button when on home screen
    this.backButtonListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (this.currentTab !== 0) {
        // If not on vehicles tab, go back to vehicles tab
        this.currentTab = 0;
      } else {
        // If on vehicles tab, show confirmation to exit
        const currentTime = new Date().getTime();
        if (currentTime - this.lastBackPress < this.backPressInterval) {
          // User pressed back twice within 2 seconds, exit the app
          CapacitorApp.exitApp();
        } else {
          // First back press, show message
          this.lastBackPress = currentTime;
          this.showExitConfirmation();
        }
      }
    });
  }

  private showExitConfirmation(): void {
    // Check if document is available (browser/mobile environment)
    if (typeof document !== 'undefined') {
      // Create a temporary toast-like message
      const toast = document.createElement('div');
      toast.textContent = '⬅️ Press back again to exit';
      toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 14px 28px;
        border-radius: 30px;
        font-size: 15px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        white-space: nowrap;
      `;
      document.body.appendChild(toast);

      // Trigger animation
      setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease-in forwards';
      }, 10);

      // Remove toast after 2 seconds
      setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 1800);
    }
  }

  ngOnDestroy() {
    if (this.backButtonListener) {
      this.backButtonListener.remove();
    }
  }
}
