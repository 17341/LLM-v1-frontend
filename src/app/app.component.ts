import { Component } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'llm-v1-frontend';
  loading = true;

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((e : RouterEvent) => {
      this.navigationInterceptor(e);
    })
  }
  
   navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      setTimeout(() => {
        this.loading = true
      }, 300);
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        this.loading = false
      }, 300);
    }

    if (event instanceof NavigationCancel) {
      setTimeout(() => {
        this.loading = false
      }, 300);
    }
    if (event instanceof NavigationError) {
      setTimeout(() => {
        this.loading = false
      }, 300);
    }
  }
}

