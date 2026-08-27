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

    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      this.error = 'Please enter both email and password.';
      return;
    }

    console.log('📤 Login attempt:');
    console.log('Email:', trimmedEmail);
    console.log('Password length:', trimmedPassword.length);

    this.userService.login(trimmedEmail, trimmedPassword).subscribe({
      next: (response) => {
        console.log('Login success:', response);

        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id.toString());
        localStorage.setItem('currentUser', JSON.stringify(response.user));

        window.dispatchEvent(new Event('auth-changed'));

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
