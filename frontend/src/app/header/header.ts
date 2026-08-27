import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  isLoggedIn = false;
  isStaff = false;
  userName = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();

    window.addEventListener('auth-changed', () => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    const staff = localStorage.getItem('currentStaff');

    this.isLoggedIn = !!token;
    this.isStaff = !!staff;

    if (user) {
      try {
        const userData = JSON.parse(user);
        this.userName = userData.firstName || userData.email || 'User';
      } catch (e) {
        this.userName = 'User';
      }
    } else if (staff) {
      try {
        const staffData = JSON.parse(staff);
        this.userName = staffData.firstName || staffData.email || 'Staff';
      } catch (e) {
        this.userName = 'Staff';
      }
    } else {
      this.userName = '';
    }

    this.cdr.detectChanges();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentStaff');

    this.isLoggedIn = false;
    this.isStaff = false;
    this.userName = '';

    this.cdr.detectChanges();
    this.router.navigate(['/']);
  }
}
