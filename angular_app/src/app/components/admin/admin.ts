import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface AdminVehicle {
  id: number;
  number: string;
  owner: string;
  timestamp: string;
  user_id: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  isLoggedIn = false;
  username = '';
  password = '';
  vehicles: AdminVehicle[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if admin is already logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      this.isLoggedIn = true;
      this.loadVehicles();
    }
  }

  async login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);

    try {
      const response = await fetch(`${this.apiService['baseUrl']}/admin/login/`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        this.isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        this.loadVehicles();
      } else {
        this.errorMessage = 'Invalid admin credentials';
      }
    } catch (error) {
      this.errorMessage = 'Login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    this.username = '';
    this.password = '';
    this.vehicles = [];
  }

  async loadVehicles() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await fetch(`${this.apiService['baseUrl']}/admin/vehicles/`);
      if (response.ok) {
        this.vehicles = await response.json();
      } else {
        this.errorMessage = 'Failed to load vehicles';
      }
    } catch (error) {
      this.errorMessage = 'Error loading vehicles';
    } finally {
      this.isLoading = false;
    }
  }

  async deleteVehicle(vehicleId: number) {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const response = await fetch(`${this.apiService['baseUrl']}/admin/vehicle/${vehicleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.successMessage = 'Vehicle deleted successfully';
        this.loadVehicles(); // Reload the list
        setTimeout(() => this.successMessage = '', 3000);
      } else {
        this.errorMessage = 'Failed to delete vehicle';
      }
    } catch (error) {
      this.errorMessage = 'Error deleting vehicle';
    } finally {
      this.isLoading = false;
    }
  }

  async exportData() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const response = await fetch(`${this.apiService['baseUrl']}/admin/export/`);
      if (response.ok) {
        const data = await response.json();
        
        // Create a download link
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vehicleq-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.successMessage = 'Data exported successfully';
        setTimeout(() => this.successMessage = '', 3000);
      } else {
        this.errorMessage = 'Failed to export data';
      }
    } catch (error) {
      this.errorMessage = 'Error exporting data';
    } finally {
      this.isLoading = false;
    }
  }

  async importData(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await fetch(`${this.apiService['baseUrl']}/admin/import/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        this.successMessage = 'Data imported successfully';
        this.loadVehicles(); // Reload the list
        setTimeout(() => this.successMessage = '', 3000);
      } else {
        const error = await response.json();
        this.errorMessage = error.detail || 'Failed to import data';
      }
    } catch (error) {
      this.errorMessage = 'Error importing data. Please check the file format.';
    } finally {
      this.isLoading = false;
      event.target.value = ''; // Reset file input
    }
  }

  viewImage(vehicleId: number) {
    window.open(`${this.apiService['baseUrl']}/image/${vehicleId}`, '_blank');
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
