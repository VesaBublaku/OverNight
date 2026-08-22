import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './booking.component.html',
})
export class BookingComponent {
  // Payment
  paymentMethod: string = 'online'; // 'online' | 'hotel'

  // Card Details
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  cardholderName: string = '';

  // Room Data (Mock)
  room = {
    number: '217',
    price: 300.86,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80',
    city: 'St Johns',
    hotelName: 'Marriott St Johns East',
    extendable: true
  };

  // Guest Details (Mock)
  guestName: string = '';
  address: string = '';
  email: string = '';
  dob: string = '';
  idType: string = 'Passport';
  idNumber: string = '';

  // Stay Details
  checkIn: string = '';
  checkOut: string = '';
  notes: string = '';
  nights: number = 0;
  subtotal: number = 0;
  tax: number = 0;
  serviceFee: number = 0;
  totalAmount: number = 0;

  constructor(private router: Router) {}

  calculateTotal(): void {
    if (this.checkIn && this.checkOut) {
      // Calculate nights
      const checkInDate = new Date(this.checkIn);
      const checkOutDate = new Date(this.checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Calculate amounts
      this.subtotal = this.nights * this.room.price;
      this.tax = this.subtotal * 0.10; // 10% tax
      this.serviceFee = this.subtotal * 0.03; // 3% service fee
      this.totalAmount = this.subtotal + this.tax + this.serviceFee;
    }
  }

  // Pay Online
  processPayment(): void {
    // Validate card details
    if (!this.cardNumber || !this.expiryDate || !this.cvv || !this.cardholderName) {
      alert('Please fill in all card details.');
      return;
    }

    // In a real app, you'd call PaymentService.createPayment()
    console.log('Processing payment...', {
      amount: this.totalAmount,
      cardNumber: this.cardNumber,
      method: 'online'
    });

    // Show success and redirect
    alert(`Payment of $${this.totalAmount.toFixed(2)} successful!`);
    this.router.navigate(['/reservations']);
  }

  // Pay at Hotel
  confirmReservation(): void {
    // In a real app, you'd create a Reservation with payment method 'hotel'
    console.log('Reservation confirmed - pay at hotel', {
      amount: this.totalAmount,
      method: 'hotel'
    });

    alert(`Reservation confirmed! Total: $${this.totalAmount.toFixed(2)} (Pay at hotel)`);
    this.router.navigate(['/reservations']);
  }
}
