import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {}

  login(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((u: any) =>
      u.email.toLowerCase() === this.email.toLowerCase() &&
      u.password === this.password
    );

    if (user) {
      localStorage.setItem('isUserLoggedIn', 'true');
      localStorage.setItem('user_name', user.name);
      localStorage.setItem('user_email', user.email);

      this.successMessage = `Welcome back, ${user.name}!`;

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } else {
      this.error = 'Invalid email or password.';
    }
  }
}
