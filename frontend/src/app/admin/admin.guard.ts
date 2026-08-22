import {inject, Injectable} from '@angular/core';
import {CanActivate, CanActivateFn, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class adminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('overnight_role');

    if (isLoggedIn && role === 'admin') {
      return true;
    }

    this.router.navigate(['/admin-login']);
    return false;
  }
}
