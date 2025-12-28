import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../../services/auth.service';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-upload-vehicle',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-vehicle.html',
  styleUrl: './upload-vehicle.css'
})
export class UploadVehicleComponent {
  vehicleNumber = '';
  owner = '';
  selectedImage: string | null = null;
  selectedImageFile: File | null = null;
  isUploading = false;

  constructor(
    private authService: AuthService,
    private vehicleService: VehicleService,
    private cdr: ChangeDetectorRef
  ) {}

  async takePicture(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        this.selectedImage = image.dataUrl;
        this.selectedImageFile = this.dataUrlToFile(image.dataUrl, 'camera-photo.jpg');
        // Manually trigger change detection
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Failed to capture photo');
    }
  }

  async pickFromGallery(): Promise<void> {
    try {
      // Clear any existing image first to ensure clean state
      this.selectedImage = null;
      this.selectedImageFile = null;
      this.cdr.detectChanges();

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        saveToGallery: false,
        correctOrientation: true,
        width: 1920,
        height: 1920
      });

      console.log('Gallery image picked:', image);

      if (image.dataUrl) {
        this.selectedImage = image.dataUrl;
        this.selectedImageFile = this.dataUrlToFile(image.dataUrl, 'gallery-photo.jpg');
        console.log('Image set successfully from dataUrl');
        // Force multiple change detection cycles
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 100);
      } else if (image.webPath) {
        // Fallback to webPath if dataUrl is not available
        console.log('Using webPath fallback');
        this.selectedImage = image.webPath;
        // Convert webPath to blob then to file
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        this.selectedImageFile = new File([blob], 'gallery-photo.jpg', { type: 'image/jpeg' });
        console.log('Image set successfully from webPath');
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 100);
      }
    } catch (error: any) {
      console.error('Error picking from gallery:', error);
      // Only show alert if user didn't cancel
      if (error.message !== 'User cancelled photos app') {
        alert('Failed to select photo from gallery');
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
        // Manually trigger change detection
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  async uploadVehicle(): Promise<void> {
    if (!this.vehicleNumber || !this.owner || !this.selectedImageFile) {
      alert('Please fill all fields and select an image');
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      alert('User not authenticated');
      return;
    }

    this.isUploading = true;
    
    this.vehicleService.uploadVehicle(
      currentUser.id,
      this.vehicleNumber,
      this.owner,
      this.selectedImageFile
    ).subscribe({
      next: () => {
        // Reset loading state BEFORE alert
        this.isUploading = false;
        
        // Clear form BEFORE alert
        this.vehicleNumber = '';
        this.owner = '';
        this.selectedImage = null;
        this.selectedImageFile = null;
        
        // Trigger change detection to update UI
        this.cdr.detectChanges();
        
        // Show success message
        alert('Vehicle uploaded successfully!');
        
        // Reload vehicles list
        this.vehicleService.loadUserVehicles(currentUser.id);
      },
      error: (error) => {
        // Reset loading state BEFORE alert
        this.isUploading = false;
        this.cdr.detectChanges();
        alert('Upload failed: ' + error.message);
      }
    });
  }

  resetForm(): void {
    this.vehicleNumber = '';
    this.owner = '';
    this.selectedImage = null;
    this.selectedImageFile = null;
    this.isUploading = false;
    // Force UI update
    this.cdr.detectChanges();
    // Additional detection cycle to ensure state is fully reset
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }
}
