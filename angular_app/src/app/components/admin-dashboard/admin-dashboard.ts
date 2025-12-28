import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService, AdminVehicle, ExportData } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-vh-100 bg-light" style="margin-top:1.5rem;">
      <!-- Header -->
      <nav class="navbar navbar-dark bg-primary shadow-sm sticky-top">
        <div class="container-fluid px-3 px-md-4">
          <span class="navbar-brand mb-0 h1 d-flex align-items-center">
            <i class="bi bi-shield-check me-2"></i>
            <span class="d-none d-sm-inline">VehicleQ Admin</span>
            <span class="d-inline d-sm-none">Admin</span>
          </span>
          <div class="d-flex gap-2 flex-wrap justify-content-end">
            <button class="btn btn-outline-light btn-sm" (click)="exportData()" [disabled]="isExporting">
              <i class="bi bi-download me-1"></i>
              <span>{{ isExporting ? 'Exporting...' : 'Export' }}</span>
            </button>
            <button class="btn btn-outline-light btn-sm" (click)="triggerImport()">
              <i class="bi bi-upload me-1"></i>
              <span>Import</span>
            </button>
            <input
              type="file"
              #fileInput
              (change)="importData($event)"
              accept=".json"
              style="display: none"
            />
            <button class="btn btn-light btn-sm" (click)="logout()">
              <i class="bi bi-box-arrow-right me-1"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="container-fluid px-3 px-md-4 py-3 py-md-4">
        <!-- Stats -->
        <div class="row g-3 mb-4">
          <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <p class="text-muted mb-1 small">Total Vehicles</p>
                    <h2 class="fw-bold text-primary mb-0">{{ vehicles.length }}</h2>
                  </div>
                  <div class="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <i class="bi bi-car-front-fill text-primary fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <p class="text-muted mb-1 small">Active Users</p>
                    <h2 class="fw-bold text-success mb-0">{{ getUniqueUsers() }}</h2>
                  </div>
                  <div class="bg-success bg-opacity-10 p-3 rounded-circle">
                    <i class="bi bi-people-fill text-success fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alert Messages -->
        <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
          <button type="button" class="btn-close" (click)="successMessage = ''"></button>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted fw-medium">Loading vehicles...</p>
        </div>

        <!-- Vehicles Table -->
        <div *ngIf="!isLoading" class="card shadow-sm border-0">
          <div class="card-header bg-white border-0 py-3">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 class="mb-0 fw-bold">
                <i class="bi bi-list-ul me-2 text-primary"></i>All Vehicles
              </h5>
              <small class="text-muted">{{ vehicles.length }} total entries</small>
            </div>
          </div>
          <div class="card-body p-0">
            <!-- Mobile Card View -->
            <div class="d-md-none">
              <div *ngFor="let vehicle of vehicles; let i = index" 
                   class="border-bottom p-3"
                   [class.bg-light]="i % 2 === 0">
                <div class="row g-2">
                  <div class="col-4">
                    <img 
                      [src]="getVehicleImage(vehicle.id)" 
                      alt="Vehicle"
                      class="img-fluid rounded shadow-sm"
                      style="width: 100%; height: 100px; object-fit: cover;"
                      (error)="onImageError($event)"
                    />
                  </div>
                  <div class="col-8">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                      <h6 class="mb-0 fw-bold text-primary">{{ vehicle.number }}</h6>
                      <span class="badge bg-primary">{{ vehicle.id }}</span>
                    </div>
                    <p class="mb-1 small text-muted">
                      <i class="bi bi-person me-1"></i>{{ vehicle.owner }}
                    </p>
                    <p class="mb-1 small text-muted">
                      <i class="bi bi-person-circle me-1"></i>{{ vehicle.username }}
                    </p>
                    <p class="mb-1 small text-muted">
                      <i class="bi bi-clock me-1"></i>{{ vehicle.timestamp | date:'short' }}
                    </p>
                  </div>
                </div>
                <div class="d-flex gap-2 mt-2">
                  <button
                    class="btn btn-sm btn-info flex-grow-1"
                    (click)="viewVehicle(vehicle)"
                  >
                    <i class="bi bi-eye"></i> View
                  </button>
                  <button
                    class="btn btn-sm btn-danger flex-grow-1"
                    (click)="deleteVehicle(vehicle.id)"
                    [disabled]="deletingId === vehicle.id"
                  >
                    <i class="bi bi-trash"></i>
                    {{ deletingId === vehicle.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </div>
              <div *ngIf="vehicles.length === 0" class="text-center py-5 text-muted">
                <i class="bi bi-inbox" style="font-size: 3rem; opacity: 0.3;"></i>
                <p class="mt-3 mb-0">No vehicles found</p>
              </div>
            </div>

            <!-- Desktop Table View -->
            <div class="table-responsive d-none d-md-block">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="px-4">Image</th>
                    <th>ID</th>
                    <th>Vehicle Number</th>
                    <th>Owner</th>
                    <th>User</th>
                    <th>Timestamp</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let vehicle of vehicles">
                    <td class="px-4">
                      <img 
                        [src]="getVehicleImage(vehicle.id)" 
                        alt="Vehicle"
                        class="rounded shadow-sm"
                        style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;"
                        (click)="viewVehicle(vehicle)"
                        (error)="onImageError($event)"
                      />
                    </td>
                    <td>
                      <span class="badge bg-primary">{{ vehicle.id }}</span>
                    </td>
                    <td>
                      <strong class="text-dark">{{ vehicle.number }}</strong>
                    </td>
                    <td>
                      <i class="bi bi-person text-muted me-1"></i>{{ vehicle.owner }}
                    </td>
                    <td>
                      <div class="d-flex flex-column">
                        <span class="fw-semibold">{{ vehicle.username }}</span>
                        <small class="text-muted">{{ vehicle.user_email }}</small>
                      </div>
                    </td>
                    <td>
                      <small class="text-muted">
                        <i class="bi bi-clock me-1"></i>{{ vehicle.timestamp | date:'short' }}
                      </small>
                    </td>
                    <td class="text-center">
                      <div class="btn-group btn-group-sm" role="group">
                        <button
                          class="btn btn-info"
                          (click)="viewVehicle(vehicle)"
                          title="View Details"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                        <button
                          class="btn btn-danger"
                          (click)="deleteVehicle(vehicle.id)"
                          [disabled]="deletingId === vehicle.id"
                          title="Delete Vehicle"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="vehicles.length === 0" class="text-center py-5 text-muted">
                <i class="bi bi-inbox" style="font-size: 4rem; opacity: 0.2;"></i>
                <p class="mt-3 mb-0 fw-medium">No vehicles found</p>
                <p class="small">Vehicles will appear here once uploaded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vehicle View Modal -->
    <div
      class="modal fade"
      [class.show]="selectedVehicle"
      [style.display]="selectedVehicle ? 'block' : 'none'"
      tabindex="-1"
      (click)="closeModal($event)"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg" *ngIf="selectedVehicle">
          <div class="modal-header bg-primary text-white border-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-car-front me-2"></i>Vehicle Details
            </h5>
            <button type="button" class="btn-close btn-close-white" (click)="selectedVehicle = null"></button>
          </div>
          <div class="modal-body p-0">
            <div class="row g-0">
              <div class="col-12 col-lg-6 bg-light d-flex align-items-center justify-content-center p-3">
                <img
                  [src]="getVehicleImage(selectedVehicle.id)"
                  alt="Vehicle Image"
                  class="img-fluid rounded shadow"
                  style="max-height: 400px; width: 100%; object-fit: contain;"
                />
              </div>
              <div class="col-12 col-lg-6 p-4">
                <div class="mb-3">
                  <label class="text-muted small mb-1">Vehicle ID</label>
                  <h6 class="fw-bold">#{{ selectedVehicle.id }}</h6>
                </div>
                <div class="mb-3">
                  <label class="text-muted small mb-1">Vehicle Number</label>
                  <h5 class="mb-0">
                    <span class="badge bg-primary fs-6">{{ selectedVehicle.number }}</span>
                  </h5>
                </div>
                <div class="mb-3">
                  <label class="text-muted small mb-1">Owner Name</label>
                  <h6 class="fw-bold">
                    <i class="bi bi-person-fill text-primary me-2"></i>{{ selectedVehicle.owner }}
                  </h6>
                </div>
                <div class="mb-3">
                  <label class="text-muted small mb-1">Uploaded By</label>
                  <h6 class="fw-bold">
                    <i class="bi bi-person-circle text-success me-2"></i>{{ selectedVehicle.username }}
                  </h6>
                  <h6 class="fw-bold">
                    <i class="bi bi-person-circle text-success me-2"></i>{{ selectedVehicle.user_email }}
                  </h6>
                 
                </div>
                <div class="mb-3">
                  <label class="text-muted small mb-1">User ID</label>
                  <h6 class="fw-bold">
                    <span class="badge bg-secondary">{{ selectedVehicle.user_id }}</span>
                  </h6>
                </div>
                <div class="mb-3">
                  <label class="text-muted small mb-1">Upload Timestamp</label>
                  <h6 class="fw-bold">
                    <i class="bi bi-clock-fill text-primary me-2"></i>{{ selectedVehicle.timestamp | date:'medium' }}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer bg-light border-0">
            <button type="button" class="btn btn-secondary" (click)="selectedVehicle = null">
              <i class="bi bi-x-circle me-1"></i>Close
            </button>
            <button type="button" class="btn btn-danger" (click)="deleteVehicle(selectedVehicle.id); selectedVehicle = null">
              <i class="bi bi-trash me-1"></i>Delete Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop fade"
      [class.show]="selectedVehicle"
      *ngIf="selectedVehicle"
    ></div>
  `,
  styles: [`
    .card {
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
    }
    
    .table th {
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .table tbody tr {
      transition: background-color 0.2s;
    }
    
    .table tbody tr:hover {
      background-color: rgba(13, 110, 253, 0.05);
    }
    
    .btn-sm {
      border-radius: 6px;
      font-weight: 500;
    }
    
    .btn-group .btn {
      padding: 0.375rem 0.75rem;
    }
    
    .badge {
      padding: 0.375rem 0.75rem;
      font-weight: 500;
    }
    
    .modal.show {
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
    }
    
    .modal-backdrop.show {
      opacity: 0.5;
    }
    
    .modal-content {
      border-radius: 16px;
      overflow: hidden;
    }
    
    .modal-header {
      padding: 1.25rem 1.5rem;
    }
    
    .alert {
      border-radius: 10px;
      border: none;
    }
    
    .navbar-brand {
      font-weight: 600;
      font-size: 1.25rem;
    }
    
    @media (max-width: 767.98px) {
      .card-body {
        padding: 1rem;
      }
      
      .modal-dialog {
        margin: 0.5rem;
      }
      
      .modal-body .col-12 {
        padding: 1rem !important;
      }
      
      .container-fluid {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
    
    @media (min-width: 768px) {
      .btn-group .btn {
        min-width: 45px;
      }
    }
    
    .bg-opacity-10 {
      --bs-bg-opacity: 0.1;
    }
    
    .sticky-top {
      z-index: 1020;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  vehicles: AdminVehicle[] = [];
  selectedVehicle: AdminVehicle | null = null;
  isLoading = false;
  isExporting = false;
  deletingId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Loading vehicles from:', this.adminService['apiUrl'] + '/admin/vehicles/');
    this.adminService.getAllVehicles().subscribe({
      next: (vehicles) => {
        console.log('Vehicles loaded successfully:', vehicles);
        console.log('Number of vehicles:', vehicles.length);
        this.vehicles = vehicles;
        this.isLoading = false;
        
        if (vehicles.length === 0) {
          console.warn('No vehicles found in database');
        }
        
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading vehicles:', error);
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);
        this.errorMessage = `Failed to load vehicles: ${error.error?.detail || error.message || error.statusText || 'Unknown error'}`;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewVehicle(vehicle: AdminVehicle): void {
    this.selectedVehicle = vehicle;
  }

  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.selectedVehicle = null;
    }
  }

  getVehicleImage(vehicleId: number): string {
    return this.adminService.getVehicleImage(vehicleId);
  }

  deleteVehicle(vehicleId: number): void {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    this.deletingId = vehicleId;
    this.selectedVehicle = null; // Close modal if open
    this.adminService.deleteVehicle(vehicleId).subscribe({
      next: () => {
        alert('Vehicle deleted successfully!');
        this.deletingId = null;
        this.loadVehicles();
      },
      error: (error: any) => {
        alert('Failed to delete vehicle. Please try again.');
        this.deletingId = null;
      }
    });
  }

  getUniqueUsers(): number {
    const uniqueUserIds = new Set(this.vehicles.map(v => v.user_id));
    return uniqueUserIds.size;
  }

  exportData(): void {
    this.isExporting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.adminService.exportData().subscribe({
      next: async (data: ExportData) => {
        const ok = await this.adminService.downloadExportAsJson(data);
        if (ok) {
          this.successMessage = 'Stored successfully!';
        } else {
          this.errorMessage = 'Failed to store export file.';
        }
        this.isExporting = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        alert('Failed to export data. Please try again.');
        this.isExporting = false;
        this.cdr.detectChanges();
      }
    });
  }

  triggerImport(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  importData(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
      // Reset input if no file selected
      input.value = '';
      return;
    }

    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        this.adminService.importData(data).subscribe({
          next: () => {
            alert('Data imported successfully!');
            this.loadVehicles();
            input.value = ''; // Reset input
          },
          error: (error: any) => {
            alert(error.error?.detail || 'Failed to import data. Please try again.');
            input.value = ''; // Reset input
          }
        });
      } catch (error: any) {
        alert('Invalid JSON file. Please check the file format.');
        input.value = ''; // Reset input
      }
    };
    reader.readAsText(file);
  }

  logout(): void {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }
    this.adminService.adminLogout();
    this.router.navigate(['/admin-login']);
  }

  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
  }
}
