import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
})
export class UserSignupComponent {
  name = '';
  email = '';
  phone = '';
  address = '';
  password = '';
  confirmPassword = '';
  error = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  signup(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }

    const nameParts = this.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const user = {
      email: this.email,
      password: this.password,
      firstName: firstName,
      lastName: lastName,
      phone: this.phone || '',
      address: this.address || ''
    };

    console.log('📤 Sending to backend:', user);

    this.userService.register(user).subscribe({
      next: (response) => {
        console.log('Registration success:', response);

        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id.toString());
        localStorage.setItem('currentUser', JSON.stringify(response.user));

        window.dispatchEvent(new Event('auth-changed'));

        this.successMessage = 'Account created successfully! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        console.error('Registration error details:', err);
        console.error('Error body:', err.error);
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
