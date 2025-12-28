import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.html',
  styleUrls: ['./splash-screen.css']
})
export class SplashScreenComponent implements OnInit, AfterViewInit {
  @ViewChild('splashVideo') videoElement!: ElementRef<HTMLVideoElement>;
  showVideo = true;
  private hasNavigated = false;
  private fallbackTimer: any;

  constructor(private router: Router) {}

  ngOnInit() {
    // Set a fallback timer (3 seconds to allow for slow loading)
    this.fallbackTimer = setTimeout(() => {
      if (!this.hasNavigated) {
        console.log('Splash screen timeout - navigating to login');
        this.navigateToLogin();
      }
    }, 4000);
  }

  ngAfterViewInit() {
    // Try to play video after view is initialized
    if (this.videoElement?.nativeElement) {
      const video = this.videoElement.nativeElement;
      
      // Handle video loaded and ready to play
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
        video.classList.add('loaded');
        // Try to play
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video playing');
            })
            .catch((error) => {
              console.error('Autoplay failed:', error);
              // If autoplay fails, navigate immediately
              this.navigateToLogin();
            });
        }
      });

      // If video doesn't start loading within 2 seconds, navigate
      setTimeout(() => {
        if (video.readyState === 0) {
          console.error('Video not loading');
          this.navigateToLogin();
        }
      }, 2000);
    }
  }

  onVideoEnded() {
    console.log('Video ended');
    this.navigateToLogin();
  }

  onVideoError(event: any) {
    console.error('Video error:', event);
    this.navigateToLogin();
  }

  onVideoLoaded() {
    // This is called from the template when video data is loaded
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.classList.add('loaded');
    }
  }

  private navigateToLogin() {
    if (this.hasNavigated) return;
    
    this.hasNavigated = true;
    this.showVideo = false;
    
    // Clear the fallback timer
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
    }
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

  ngOnDestroy() {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
    }
  }
}
