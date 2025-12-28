import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('VehicleQ');
  private routerSubscription?: Subscription;
  private backButtonListener?: PluginListenerHandle;
  private currentRoute = '';

  constructor(private router: Router) {}

  async ngOnInit() {
    // Skip Capacitor initialization during SSR
    if (typeof window === 'undefined') {
      return;
    }

    // Track current route
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });

    // Handle hardware back button for non-home routes
    this.backButtonListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      // Only handle back button if not on home or login page
      // Home component will handle its own back button
      if (this.currentRoute !== '/login' && this.currentRoute !== '/home') {
        if (canGoBack) {
          window.history.back();
        } else {
          this.router.navigate(['/home']);
        }
      } else if (this.currentRoute === '/login') {
        // On login page, exit directly
        CapacitorApp.exitApp();
      }
      // Home page back button is handled by HomeComponent
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.backButtonListener) {
      this.backButtonListener.remove();
    }
  }
}
