import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class staffGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('overnight_role');

    if (isLoggedIn && role === 'staff') {
      return true;
    }

    this.router.navigate(['/staff/login']);
    return false;
  }
}
