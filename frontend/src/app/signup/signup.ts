import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
})
export class UserSignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  successMessage = '';

  constructor(private router: Router) {}

  signup(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields.';
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

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((u: any) => u.email.toLowerCase() === this.email.toLowerCase())) {
      this.error = 'An account with this email already exists.';
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    this.successMessage = 'Account created successfully! Redirecting to login...';

    setTimeout(() => {
      this.router.navigate(['/user/login']);
    }, 1500);
  }
}
