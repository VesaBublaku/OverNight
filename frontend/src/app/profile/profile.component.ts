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
    points: '12,450',
    phone: '',
    address: '',
    dob: ''
  };

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

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('User from localStorage:', userData);

        this.user = {
          id: userData.id,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
          email: userData.email,
          memberSince: userData.memberSince || new Date().getFullYear().toString(),
          tier: 'Gold Status',
          points: '12,450',
          phone: userData.phone || '',
          address: userData.address || '',
          dob: userData.dob || ''
        };
        this.isLoading = false;
        this.cdr.detectChanges();

        this.refreshUserFromServer();
        return;
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    this.fetchUserFromServer();
  }

  refreshUserFromServer(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn('No userId found in localStorage');
      return;
    }

    console.log('Refreshing user from server for ID:', userId);

    this.userService.getUserById(Number(userId)).subscribe({
      next: (data) => {
        console.log('User from server:', data);
        if (data) {
          this.user = {
            id: data.id,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email,
            email: data.email,
            memberSince: data.memberSince || new Date().getFullYear().toString(),
            tier: 'Gold Status',
            points: '12,450',
            phone: data.phone || '',
            address: data.address || '',
            dob: data.dob || ''
          };
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.cdr.detectChanges();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error refreshing user from server:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchUserFromServer(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(Number(userId)).subscribe({
        next: (data) => {
          console.log('User from server:', data);
          this.user = {
            id: data.id,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email,
            email: data.email,
            memberSince: data.memberSince || new Date().getFullYear().toString(),
            tier: 'Gold Status',
            points: '12,450',
            phone: data.phone || '',
            address: data.address || '',
            dob: data.dob || ''
          };
          localStorage.setItem('currentUser', JSON.stringify(data));
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
      this.userService.getCurrentUser().subscribe({
        next: (data) => {
          console.log('User from /me endpoint:', data);
          this.user = {
            id: data.id,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email,
            email: data.email,
            memberSince: data.memberSince || new Date().getFullYear().toString(),
            tier: 'Gold Status',
            points: '12,450',
            phone: data.phone || '',
            address: data.address || '',
            dob: data.dob || ''
          };
          localStorage.setItem('userId', String(data.id));
          localStorage.setItem('currentUser', JSON.stringify(data));
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

    const nameParts = this.user.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const updatedUser: any = {
      firstName: firstName,
      lastName: lastName,
      phone: this.user.phone,
      address: this.user.address,
      dob: this.user.dob || '',
      memberSince: this.user.memberSince || ''
    };

    console.log('Sending update:', updatedUser);

    if (this.user.id) {
      this.userService.updateUser(this.user.id, updatedUser as User).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.successMessage = 'Profile updated successfully!';
          this.isLoading = false;

          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            const cached = JSON.parse(storedUser);
            cached.firstName = firstName;
            cached.lastName = lastName;
            cached.phone = this.user.phone;
            cached.address = this.user.address;
            cached.dob = this.user.dob;
            cached.memberSince = this.user.memberSince;
            localStorage.setItem('currentUser', JSON.stringify(cached));
          }

          this.loadUserProfile();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.errorMessage = err.error?.message || 'Failed to update profile.';
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
