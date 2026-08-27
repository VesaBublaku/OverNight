import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {
    id: undefined,
    name: '',
    email: '',
    memberSince: '',
    tier: 'Gold Status',
    points: '0',
    phone: '',
    address: ''
  };

  editingUser: any = {};
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // ✅ Get user ID from localStorage (set during login)
    const userId = localStorage.getItem('userId');

    if (userId) {
      // Fetch user by ID directly - no need for /me endpoint
      this.userService.getUserById(Number(userId)).subscribe({
        next: (data) => {
          this.user = {
            id: data.id,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email,
            email: data.email,
            memberSince: data.memberSince || new Date().getFullYear().toString(),
            tier: 'Gold Status',
            points: '12,450',
            phone: data.phone || '',
            address: data.address || ''
          };
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading user profile:', err);
          this.errorMessage = 'Failed to load profile. Please log in again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Fallback: Try to get current user from /me endpoint
      this.userService.getCurrentUser().subscribe({
        next: (data) => {
          this.user = {
            id: data.id,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email,
            email: data.email,
            memberSince: data.memberSince || new Date().getFullYear().toString(),
            tier: 'Gold Status',
            points: '12,450',
            phone: data.phone || '',
            address: data.address || ''
          };
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading user profile:', err);
          this.errorMessage = 'Failed to load profile. Please log in again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  saveChanges(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Split name into firstName and lastName
    const nameParts = this.user.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const updatedUser: any = {
      firstName: firstName,
      lastName: lastName,
      phone: this.user.phone,
      address: this.user.address
    };

    // ✅ Use user ID to update
    if (this.user.id) {
      this.userService.updateUser(this.user.id, updatedUser as User).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully!';
          this.isLoading = false;
          this.cdr.detectChanges();

          // Update localStorage
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            const cached = JSON.parse(storedUser);
            cached.firstName = firstName;
            cached.lastName = lastName;
            cached.phone = this.user.phone;
            cached.address = this.user.address;
            localStorage.setItem('currentUser', JSON.stringify(cached));
          }
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.errorMessage = 'Failed to update profile.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.errorMessage = 'Failed to update profile. No user ID available.';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
