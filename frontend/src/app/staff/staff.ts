import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  dob?: string;
  memberSince?: string;
  idType?: string;
  idNumber?: string;
  isActive?: boolean;
  city?: string;
}

interface Reservation {
  id: number;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  roomId?: number;
  roomNumber: string;
  hotel: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: string;
  nights?: number;
  guests?: number;
  requests?: string;
}

interface Room {
  id: number;
  number: string;
  price: number;
  hotel: string;
}

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.html',
})
export class StaffDashboardComponent {
  showReservationModal = false;
  showCustomerModal = false;
  showDeleteConfirm = false;

  deleteTarget: { type: 'customer' | 'reservation'; id: number } | null = null;

  editingReservation: Partial<Reservation> = {};
  editingCustomer: Partial<Customer> = {};

  searchQuery = '';

  customers: Customer[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 416-555-0123',
      address: '123 Main St, Toronto, ON',
      dob: '1985-05-15',
      memberSince: '2025',
      idType: 'Passport',
      idNumber: 'AB123456',
      isActive: true,
      city: 'Toronto'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 604-555-0456',
      address: '456 Oak Ave, Vancouver, BC',
      dob: '1990-08-22',
      memberSince: '2025',
      idType: "Driver's Lic",
      idNumber: 'DL789012',
      isActive: true,
      city: 'Vancouver'
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Johnson',
      name: 'Robert Johnson',
      email: 'robert.j@email.com',
      phone: '+1 514-555-0789',
      address: '789 Pine St, Montreal, QC',
      dob: '1978-12-03',
      memberSince: '2024',
      idType: 'National ID',
      idNumber: 'NI345678',
      isActive: true,
      city: 'Montreal'
    },
  ];

  reservations: Reservation[] = [
    {
      id: 1,
      customerId: 1,
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      roomId: 1,
      roomNumber: '217',
      hotel: 'Marriott St Johns East',
      checkIn: '2026-08-20',
      checkOut: '2026-08-25',
      total: 1504.30,
      status: 'active',
      nights: 5,
      guests: 2
    },
    {
      id: 2,
      customerId: 2,
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      roomId: 4,
      roomNumber: '122',
      hotel: 'Delta Coventry Suites',
      checkIn: '2026-09-01',
      checkOut: '2026-09-05',
      total: 1652.84,
      status: 'upcoming',
      nights: 4,
      guests: 3
    },
  ];

  private nextReservationId = 3;

  constructor(private router: Router) {}

  get totalCustomers(): number {
    return this.customers.length;
  }

  get activeReservations(): number {
    return this.reservations.filter(r => r.status === 'active').length;
  }

  get upcomingReservations(): number {
    return this.reservations.filter(r => r.status === 'upcoming').length;
  }

  get totalRevenue(): string {
    return this.reservations
      .filter(r => r.status === 'active' || r.status === 'completed')
      .reduce((sum, r) => sum + r.total, 0)
      .toFixed(2);
  }

  get filteredCustomers(): Customer[] {
    const q = this.searchQuery.toLowerCase();
    return this.customers.filter(c =>
      (c.name?.toLowerCase().includes(q) || false) ||
      (c.firstName?.toLowerCase().includes(q) || false) ||
      (c.lastName?.toLowerCase().includes(q) || false) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone?.includes(q) || false) ||
      (c.city?.toLowerCase().includes(q) || false)
    );
  }

  getCustomerReservations(customerId: number): Reservation[] {
    return this.reservations.filter(r =>
      r.customerId === customerId &&
      (r.status === 'active' || r.status === 'upcoming')
    );
  }

  get availableRooms(): Room[] {
    return [
      { id: 1, number: '217', price: 300.86, hotel: 'Marriott St Johns East' },
      { id: 2, number: '218', price: 260.00, hotel: 'Marriott St Johns East' },
      { id: 3, number: '219', price: 350.00, hotel: 'Marriott St Johns East' },
      { id: 4, number: '122', price: 413.21, hotel: 'Delta Coventry Suites' },
    ];
  }

  openEditCustomer(customer: Customer): void {
    this.editingCustomer = { ...customer };
    this.showCustomerModal = true;
  }

  saveCustomer(): void {
    if (this.editingCustomer.id) {
      const idx = this.customers.findIndex(c => c.id === this.editingCustomer.id);
      if (idx > -1) {
        this.editingCustomer.name = `${this.editingCustomer.firstName} ${this.editingCustomer.lastName}`;
        this.customers[idx] = { ...this.customers[idx], ...this.editingCustomer } as Customer;
      }
    } else {
      const newCustomer = {
        ...this.editingCustomer,
        id: this.customers.length + 1,
        name: `${this.editingCustomer.firstName} ${this.editingCustomer.lastName}`,
        isActive: true
      } as Customer;
      this.customers.push(newCustomer);
    }
    this.showCustomerModal = false;
    this.editingCustomer = {};
  }

  openAddReservation(customerId?: number): void {
    this.editingReservation = {
      customerId: customerId || undefined,
      roomId: undefined,
      checkIn: '',
      checkOut: '',
      guests: 1,
      requests: '',
      status: 'upcoming'
    };
    this.showReservationModal = true;
  }

  saveReservation(): void {
    if (this.editingReservation.id) {
      const idx = this.reservations.findIndex(r => r.id === this.editingReservation.id);
      if (idx > -1) {
        this.reservations[idx] = { ...this.reservations[idx], ...this.editingReservation } as Reservation;
      }
    } else {
      const customer = this.customers.find(c => c.id === this.editingReservation.customerId);
      const room = this.availableRooms.find(r => r.id === this.editingReservation.roomId);

      const newReservation: Reservation = {
        id: this.nextReservationId++,
        customerId: this.editingReservation.customerId || 0,
        customerName: customer?.name || customer?.firstName + ' ' + customer?.lastName || 'Guest',
        customerEmail: customer?.email || '',
        roomId: this.editingReservation.roomId || 0,
        roomNumber: room?.number || '',
        hotel: room?.hotel || '',
        checkIn: this.editingReservation.checkIn || '',
        checkOut: this.editingReservation.checkOut || '',
        nights: 0,
        guests: this.editingReservation.guests || 1,
        total: 0,
        status: 'upcoming',
        requests: this.editingReservation.requests || ''
      };

      this.reservations.push(newReservation);
    }

    this.showReservationModal = false;
    this.editingReservation = {};
  }

  confirmDelete(type: 'customer' | 'reservation', id: number): void {
    this.deleteTarget = { type, id };
    this.showDeleteConfirm = true;
  }

  executeDelete(): void {
    if (!this.deleteTarget) return;

    if (this.deleteTarget.type === 'customer') {
      this.customers = this.customers.filter(c => c.id !== this.deleteTarget!.id);
      this.reservations = this.reservations.filter(r => r.customerId !== this.deleteTarget!.id);
    } else if (this.deleteTarget.type === 'reservation') {
      const reservation = this.reservations.find(r => r.id === this.deleteTarget!.id);
      if (reservation) {
        reservation.status = 'cancelled';
      }
    }

    this.showDeleteConfirm = false;
    this.deleteTarget = null;
  }

  goToPayments(): void {
    this.router.navigate(['/staff/payments']);
  }
}
