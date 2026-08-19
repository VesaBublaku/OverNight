import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './log-in.html',
})
export class UserLoginComponent {
  email = '';
  password = '';
  error = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  login(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password.';
      return;
    }

    this.userService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.successMessage = 'Login successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || 'Invalid email or password.';
      }
    });
  }
}
