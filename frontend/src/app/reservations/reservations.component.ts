import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';
import {Reservation, ReservationService} from '../services/reservation.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit, OnDestroy {
  upcomingReservations: any[] = [];
  pastReservations: any[] = [];
  loading = true;
  error: string | null = null;
  currentUser: any = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user && user.id) {
          this.loadUserReservations(user.id);
        } else {
          this.loading = false;
          this.error = 'Please log in to view your reservations';
          this.upcomingReservations = [];
          this.pastReservations = [];
          this.cdr.detectChanges();
        }
      })
    );
  }

  loadUserReservations(userId: number) {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    console.log(`Loading reservations for user ID: ${userId}`);

    this.subscriptions.push(
      this.reservationService.getUserReservations(userId).subscribe({
        next: (reservations) => {
          console.log(`Found ${reservations.length} reservations`);
          this.processReservations(reservations);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading reservations:', error);
          this.error = 'Failed to load your reservations. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  private processReservations(reservations: Reservation[]) {
    if (!reservations || reservations.length === 0) {
      this.upcomingReservations = [];
      this.pastReservations = [];
      this.cdr.detectChanges();
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formattedReservations = reservations.map(res => ({
      id: res.reservationNumber || `RES-${res.id}`,
      hotelName: res.room?.hotel?.name || 'Hotel',
      city: res.room?.hotel?.cityName || 'City',
      room: res.room?.roomNumber || 'N/A',
      checkIn: this.formatDate(res.checkInDate),
      checkOut: this.formatDate(res.checkOutDate),
      guests: res.guests || 1,
      total: `CA$${res.totalPrice?.toFixed(2) || '0.00'}`,
      status: this.getStatusDisplay(res.status || 'pending'),
      image: this.getHotelImage(res.room?.hotel?.name || 'hotel'),
      rawCheckIn: res.checkInDate,
      rawCheckOut: res.checkOutDate
    }));

    this.upcomingReservations = formattedReservations
      .filter(r => r.rawCheckIn && new Date(r.rawCheckIn) >= today)
      .sort((a, b) => {
        if (!a.rawCheckIn || !b.rawCheckIn) return 0;
        return new Date(a.rawCheckIn).getTime() - new Date(b.rawCheckIn).getTime();
      });

    this.pastReservations = formattedReservations
      .filter(r => r.rawCheckIn && new Date(r.rawCheckIn) < today)
      .sort((a, b) => {
        if (!a.rawCheckIn || !b.rawCheckIn) return 0;
        return new Date(b.rawCheckIn).getTime() - new Date(a.rawCheckIn).getTime();
      });

    this.cdr.detectChanges();
  }

  private formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }

  private getStatusDisplay(status: string): string {
    const statusMap: { [key: string]: string } = {
      'confirmed': 'Confirmed',
      'pending': 'Pending',
      'cancelled': 'Cancelled',
      'completed': 'Completed',
      'checked_in': 'Checked In',
      'checked_out': 'Checked Out'
    };
    return statusMap[status.toLowerCase()] || status;
  }

  private getHotelImage(hotelName: string): string {
    const imageMap: { [key: string]: string } = {
      'marriott': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      'westin': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'delta': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      'hilton': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'default': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
    };

    const searchName = hotelName.toLowerCase();
    for (const [key, value] of Object.entries(imageMap)) {
      if (searchName.includes(key)) {
        return value;
      }
    }
    return imageMap['default'];
  }

  refreshReservations() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.loadUserReservations(user.id);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
