import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, User } from '../services/user.service';
import { ReservationService, Reservation } from '../services/reservation.service';
import { RoomService, Room } from '../services/room.service';
import { HotelService, Hotel } from '../services/hotel.service';

interface ExtendedUser extends User {
  dob?: string;
  idType?: string;
  idNumber?: string;
}

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.html',
})
export class StaffDashboardComponent implements OnInit {
  showReservationModal = false;
  showCustomerModal = false;
  showDeleteConfirm = false;

  deleteTarget: { type: 'customer' | 'reservation'; id: number } | null = null;

  editingReservation: any = {};
  editingCustomer: Partial<ExtendedUser> = {};

  searchQuery = '';

  customers: ExtendedUser[] = [];
  reservations: Reservation[] = [];
  availableRooms: Room[] = [];
  hotels: Hotel[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private reservationService: ReservationService,
    private roomService: RoomService,
    private hotelService: HotelService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadReservations();
    this.loadAvailableRooms();
    this.loadHotels();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.customers = (data || []).map(user => ({
          ...user,
          dob: (user as any).dob || '',
          idType: (user as any).idType || '',
          idNumber: (user as any).idNumber || ''
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.errorMessage = 'Failed to load customers. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadAvailableRooms(): void {
    this.roomService.getActiveRooms().subscribe({
      next: (data) => {
        this.availableRooms = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading available rooms:', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (data) => {
        this.hotels = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.cdr.detectChanges();
      }
    });
  }

  get totalCustomers(): number {
    return this.customers.length;
  }

  get activeReservations(): number {
    return this.reservations.filter(r =>
      r.status === 'ACTIVE' || r.status === 'active'
    ).length;
  }

  get upcomingReservations(): number {
    return this.reservations.filter(r =>
      r.status === 'UPCOMING' || r.status === 'upcoming'
    ).length;
  }

  get totalRevenue(): string {
    const total = this.reservations
      .filter(r => r.status === 'ACTIVE' || r.status === 'active' || r.status === 'COMPLETED' || r.status === 'completed')
      .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    return total.toFixed(2);
  }

  get filteredCustomers(): ExtendedUser[] {
    const q = this.searchQuery.toLowerCase();

    const regularCustomers = this.customers.filter(c =>
      (c.firstName?.toLowerCase().includes(q) || false) ||
      (c.lastName?.toLowerCase().includes(q) || false) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone?.includes(q) || false) ||
      (c.address?.toLowerCase().includes(q) || false)
    );

    return regularCustomers;
  }

  getCustomerReservations(customerId: number | undefined): Reservation[] {
    if (!customerId) return [];

    if (customerId === -1) {
      return this.unassignedReservations;
    }

    return this.reservations.filter(r =>
      r.user?.id === customerId &&
      (r.status === 'ACTIVE' || r.status === 'active' ||
        r.status === 'UPCOMING' || r.status === 'upcoming' ||
        r.status === 'CONFIRMED' || r.status === 'confirmed')
    );
  }

  get unassignedReservations(): Reservation[] {
    return this.reservations.filter(r =>
      !r.user &&
      (r.status === 'ACTIVE' || r.status === 'active' ||
        r.status === 'UPCOMING' || r.status === 'upcoming' ||
        r.status === 'CONFIRMED' || r.status === 'confirmed')
    );
  }

  getHotelNameForRoom(room: Room | null | undefined): string {
    if (!room) return 'Hotel';
    if (!room.hotelId) return 'Hotel';

    const hotel = this.hotels.find(h => h.id === room.hotelId);
    return hotel?.name || 'Hotel';
  }

  getRoomNumber(room: Room | null | undefined): string {
    if (!room) return '---';
    return room.roomNumber || '---';
  }

  confirmDelete(type: 'customer' | 'reservation', id: number | undefined): void {
    if (!id) return;
    this.deleteTarget = { type, id };
    this.showDeleteConfirm = true;
  }

  getHotelNameById(hotelId?: number): string {
    if (!hotelId) return 'Hotel';
    const hotel = this.hotels.find(h => h.id === hotelId);
    return hotel?.name || 'Hotel';
  }

  openEditCustomer(customer: ExtendedUser): void {
    this.editingCustomer = { ...customer };
    this.showCustomerModal = true;
  }

  saveCustomer(): void {
    if (!this.editingCustomer.id) return;

    this.isLoading = true;
    this.userService.updateUser(this.editingCustomer.id, this.editingCustomer as User).subscribe({
      next: () => {
        this.loadCustomers();
        this.showCustomerModal = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating customer:', err);
        this.errorMessage = 'Failed to update customer.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddReservation(customerId?: number): void {
    this.editingReservation = {
      user: customerId ? { id: customerId } : null,
      room: null,
      checkInDate: '',
      checkOutDate: '',
      guests: 1,
      specialRequests: '',
      status: 'UPCOMING'
    };
    this.showReservationModal = true;
  }

  openEditReservation(reservation: any): void {
    this.editingReservation = { ...reservation };
    this.showReservationModal = true;
  }

  saveReservation(): void {
    this.isLoading = true;

    const reservationData = {
      user: this.editingReservation.user ? { id: this.editingReservation.user.id } : null,
      room: this.editingReservation.room ? { id: this.editingReservation.room.id } : null,
      checkInDate: this.editingReservation.checkInDate,
      checkOutDate: this.editingReservation.checkOutDate,
      guests: this.editingReservation.guests || 1,
      specialRequests: this.editingReservation.specialRequests || '',
      status: this.editingReservation.status || 'UPCOMING'
    };

    if (this.editingReservation.id) {
      this.reservationService.updateReservation(this.editingReservation.id, reservationData).subscribe({
        next: () => {
          this.loadReservations();
          this.showReservationModal = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating reservation:', err);
          this.errorMessage = 'Failed to update reservation.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.reservationService.createReservation(reservationData).subscribe({
        next: () => {
          this.loadReservations();
          this.showReservationModal = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error creating reservation:', err);
          this.errorMessage = 'Failed to create reservation.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  executeDelete(): void {
    if (!this.deleteTarget) return;

    if (this.deleteTarget.type === 'reservation') {
      this.reservationService.cancelReservation(this.deleteTarget.id).subscribe({
        next: () => {
          this.loadReservations();
          this.showDeleteConfirm = false;
          this.deleteTarget = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cancelling reservation:', err);
          this.cdr.detectChanges();
        }
      });
    } else {
      this.customers = this.customers.filter(c => c.id !== this.deleteTarget!.id);
      this.showDeleteConfirm = false;
      this.deleteTarget = null;
      this.cdr.detectChanges();
    }
  }

  goToPayments(): void {
    this.router.navigate(['/staff/payments']);
  }

  getCustomerName(user: any): string {
    if (!user) return 'Guest';
    if (user.id === -1) return 'Guest User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Guest';
  }
}
