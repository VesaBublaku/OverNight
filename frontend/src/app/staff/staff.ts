import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Customer {
  id: number;
  name: string;
  email: string;
  city: string;
  dob: string;
  idType: string;
  idNumber: string;
  phone?: string;
}

interface Reservation {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  roomId: number;
  roomNumber: string;
  hotel: string;
  hotelId: number;
  capacity: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  requests: string;
  createdAt: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

interface Hotel {
  id: number;
  name: string;
  city: string;
  rooms: Room[];
}

interface Room {
  id: number;
  number: string;
  price: number;
  capacity: number;
  extendable: boolean;
  amenities: string;
  condition: string;
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
  editingCustomer: Partial<Customer> = {};  // ← ADD THIS

  searchQuery = '';

  staffName = '';
  staffRole = '';
  staffHotel = '';

  customers: Customer[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@email.com', city: 'Toronto', dob: '1985-05-15', idType: 'Passport', idNumber: 'AB123456', phone: '+1 416-555-0123' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', city: 'Vancouver', dob: '1990-08-22', idType: "Driver's Lic", idNumber: 'DL789012', phone: '+1 604-555-0456' },
    { id: 3, name: 'Robert Johnson', email: 'robert.j@email.com', city: 'Montreal', dob: '1978-12-03', idType: 'National ID', idNumber: 'NI345678', phone: '+1 514-555-0789' },
    { id: 4, name: 'Sarah Williams', email: 'sarah.w@email.com', city: 'Ottawa', dob: '1995-03-10', idType: 'Passport', idNumber: 'CD901234', phone: '+1 613-555-0123' },
    { id: 5, name: 'Michael Brown', email: 'michael.b@email.com', city: 'Calgary', dob: '1982-07-18', idType: "Driver's Lic", idNumber: 'DL567890', phone: '+1 403-555-0456' },
  ];

  hotels: Hotel[] = [
    {
      id: 1, name: 'Marriott St Johns East', city: 'St Johns',
      rooms: [
        { id: 1, number: '217', price: 300.86, capacity: 4, extendable: true, amenities: 'WiFi, AC, Smart TV, Work Desk', condition: 'Good' },
        { id: 2, number: '218', price: 260.00, capacity: 2, extendable: false, amenities: 'WiFi, AC', condition: 'Good' },
        { id: 3, number: '219', price: 350.00, capacity: 4, extendable: true, amenities: 'WiFi, AC, Smart TV, Mini Bar', condition: 'Excellent' },
      ]
    },
    {
      id: 2, name: 'Delta Coventry Suites', city: 'Ottawa',
      rooms: [
        { id: 4, number: '122', price: 413.21, capacity: 4, extendable: true, amenities: 'WiFi, AC, Premium Bedding, Smart TV', condition: 'Good' },
        { id: 5, number: '123', price: 380.00, capacity: 2, extendable: false, amenities: 'WiFi, AC, Work Desk', condition: 'Good' },
      ]
    },
    {
      id: 3, name: 'Westin Montreal Notre-Dame', city: 'Montreal',
      rooms: [
        { id: 6, number: '138', price: 306.98, capacity: 4, extendable: true, amenities: 'WiFi, AC, Smart TV, Mini Bar', condition: 'Excellent' },
        { id: 7, number: '139', price: 280.00, capacity: 2, extendable: false, amenities: 'WiFi, AC', condition: 'Good' },
      ]
    }
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
      hotelId: 1,
      capacity: 4,
      checkIn: '2026-08-20',
      checkOut: '2026-08-25',
      nights: 5,
      guests: 2,
      total: 1504.30,
      status: 'active',
      requests: 'Need extra pillows',
      createdAt: '2026-07-15',
      paymentStatus: 'paid'
    },
    {
      id: 2,
      customerId: 2,
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      roomId: 4,
      roomNumber: '122',
      hotel: 'Delta Coventry Suites',
      hotelId: 2,
      capacity: 4,
      checkIn: '2026-09-01',
      checkOut: '2026-09-05',
      nights: 4,
      guests: 3,
      total: 1652.84,
      status: 'upcoming',
      requests: '',
      createdAt: '2026-08-01',
      paymentStatus: 'pending'
    },
    {
      id: 3,
      customerId: 3,
      customerName: 'Robert Johnson',
      customerEmail: 'robert.j@email.com',
      roomId: 2,
      roomNumber: '218',
      hotel: 'Marriott St Johns East',
      hotelId: 1,
      capacity: 2,
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      nights: 2,
      guests: 1,
      total: 520.00,
      status: 'completed',
      requests: '',
      createdAt: '2026-07-20',
      paymentStatus: 'paid'
    },
    {
      id: 4,
      customerId: 4,
      customerName: 'Sarah Williams',
      customerEmail: 'sarah.w@email.com',
      roomId: 6,
      roomNumber: '138',
      hotel: 'Westin Montreal Notre-Dame',
      hotelId: 3,
      capacity: 4,
      checkIn: '2026-09-10',
      checkOut: '2026-09-15',
      nights: 5,
      guests: 2,
      total: 1534.90,
      status: 'upcoming',
      requests: 'Late check-in requested',
      createdAt: '2026-08-15',
      paymentStatus: 'pending'
    }
  ];

  private nextReservationId = 5;
  private nextCustomerId = 6;

  constructor(private router: Router) {
    this.staffName = localStorage.getItem('staff_name') || 'Staff User';
    this.staffRole = localStorage.getItem('staff_role') || 'Staff';
    this.staffHotel = localStorage.getItem('staff_hotel') || 'LuxStay';
  }

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
      .filter(r => r.paymentStatus === 'paid')
      .reduce((sum, r) => sum + r.total, 0)
      .toFixed(2);
  }

  get filteredCustomers(): Customer[] {
    const q = this.searchQuery.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  }

  getCustomerReservations(customerId: number): Reservation[] {
    return this.reservations.filter(r =>
      r.customerId === customerId &&
      (r.status === 'active' || r.status === 'upcoming')
    );
  }

  get availableRooms(): any[] {
    const bookedRoomIds = this.reservations
      .filter(r => r.status === 'active' || r.status === 'upcoming')
      .map(r => r.roomId);

    const allRooms: any[] = [];
    this.hotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        if (!bookedRoomIds.includes(room.id)) {
          allRooms.push({
            ...room,
            hotel: hotel.name,
            hotelId: hotel.id
          });
        }
      });
    });
    return allRooms;
  }

  openEditCustomer(customer: Customer): void {
    this.editingCustomer = { ...customer };
    this.showCustomerModal = true;
  }

  saveCustomer(): void {
    if (this.editingCustomer.id) {
      const idx = this.customers.findIndex(c => c.id === this.editingCustomer.id);
      if (idx > -1) {
        this.customers[idx] = { ...this.customers[idx], ...this.editingCustomer } as Customer;
      }
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

  openEditReservation(r: Reservation): void {
    this.editingReservation = { ...r };
    this.showReservationModal = true;
  }

  saveReservation(): void {
    if (this.editingReservation.id) {
      const idx = this.reservations.findIndex(r => r.id === this.editingReservation.id);
      if (idx > -1) {
        const checkIn = new Date(this.editingReservation.checkIn || '');
        const checkOut = new Date(this.editingReservation.checkOut || '');
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

        const room = this.getRoomById(this.editingReservation.roomId || 0);
        const customer = this.getCustomerById(this.editingReservation.customerId || 0);
        const total = nights * (room?.price || 0);

        this.reservations[idx] = {
          ...this.reservations[idx],
          ...this.editingReservation,
          nights: nights || 0,
          total: total,
          roomNumber: room?.number || '',
          hotel: room?.hotel || '',
          customerName: customer?.name || '',
          customerEmail: customer?.email || '',
          capacity: room?.capacity || 0
        } as Reservation;
      }
    } else {
      const checkIn = new Date(this.editingReservation.checkIn || '');
      const checkOut = new Date(this.editingReservation.checkOut || '');
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      const room = this.getRoomById(this.editingReservation.roomId || 0);
      const customer = this.getCustomerById(this.editingReservation.customerId || 0);
      const total = nights * (room?.price || 0);

      const newReservation: Reservation = {
        id: this.nextReservationId++,
        customerId: this.editingReservation.customerId || 0,
        customerName: customer?.name || '',
        customerEmail: customer?.email || '',
        roomId: this.editingReservation.roomId || 0,
        roomNumber: room?.number || '',
        hotel: room?.hotel || '',
        hotelId: room?.hotelId || 0,
        capacity: room?.capacity || 0,
        checkIn: this.editingReservation.checkIn || '',
        checkOut: this.editingReservation.checkOut || '',
        nights: nights || 0,
        guests: this.editingReservation.guests || 1,
        total: total,
        status: 'upcoming',
        requests: this.editingReservation.requests || '',
        createdAt: new Date().toISOString().split('T')[0],
        paymentStatus: 'pending'
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
      this.reservations = this.reservations.filter(r => r.id !== this.deleteTarget!.id);
    }

    this.showDeleteConfirm = false;
    this.deleteTarget = null;
  }

  private getRoomById(roomId: number): any {
    for (const hotel of this.hotels) {
      const room = hotel.rooms.find(r => r.id === roomId);
      if (room) {
        return {
          ...room,
          hotel: hotel.name,
          hotelId: hotel.id
        };
      }
    }
    return null;
  }

  private getCustomerById(customerId: number): Customer | undefined {
    return this.customers.find(c => c.id === customerId);
  }

  goToPayments(): void {
    this.router.navigate(['/staff/payments']);
  }

  logout(): void {
    localStorage.removeItem('overnight_role');
    localStorage.removeItem('staff_name');
    localStorage.removeItem('staff_role');
    localStorage.removeItem('staff_hotel');
    localStorage.removeItem('staff_email');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/staff/login']);
  }
}
