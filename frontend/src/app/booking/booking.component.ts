import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { ReservationService } from '../services/reservation.service';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
  paymentMethod: string = 'online';
  roomId: number = 0;

  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  cardholderName: string = '';

  room: any = {
    id: 0,
    number: '',
    price: 0,
    image: '',
    city: '',
    hotelName: '',
    extendable: false
  };

  guestName: string = '';
  address: string = '';
  email: string = '';
  dob: string = '';
  idType: string = 'Passport';
  idNumber: string = '';
  phone: string = '';

  checkIn: string = '';
  checkOut: string = '';
  notes: string = '';
  nights: number = 0;
  guests: number = 1;
  subtotal: number = 0;
  tax: number = 0;
  serviceFee: number = 0;
  totalAmount: number = 0;

  isAvailable: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';
  unavailableDates: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.roomId = parseInt(id);
        this.loadRoomDetails();
        this.loadUnavailableDates();
      } else {
        this.loadMockRoom();
      }
    });

    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const currentUser = JSON.parse(userJson);
        this.email = currentUser.email || '';
        this.guestName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
        this.phone = currentUser.phone || '';
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
  }

  loadRoomDetails(): void {
    this.isLoading = true;
    this.roomService.getRoomById(this.roomId).subscribe({
      next: (data) => {
        this.room = data;
        this.isLoading = false;
        this.room.price = data.price || 0;
        this.room.number = data.roomNumber || data.number || 'N/A';
        if (data.hotelId) {
          this.loadHotelInfo(data.hotelId);
        }
      },
      error: (error) => {
        console.error('Error loading room:', error);
        this.errorMessage = 'Failed to load room details';
        this.isLoading = false;
        this.loadMockRoom();
      }
    });
  }

  loadHotelInfo(hotelId: number): void {
    this.room.hotelName = 'Hotel Name';
    this.room.city = 'City Name';
  }

  loadUnavailableDates(): void {
    if (this.roomId) {
      this.reservationService.getUnavailableDates(this.roomId).subscribe({
        next: (dates) => {
          this.unavailableDates = dates;
        },
        error: (error) => {
          console.error('Error loading unavailable dates:', error);
        }
      });
    }
  }

  loadMockRoom(): void {
    this.room = {
      id: 217,
      number: '217',
      price: 300.86,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80',
      city: 'St Johns',
      hotelName: 'Marriott St Johns East',
      extendable: true
    };
    this.isLoading = false;
  }

  isDateUnavailable(date: string): boolean {
    return this.unavailableDates.includes(date);
  }

  checkAvailability(): void {
    if (!this.checkIn || !this.checkOut) {
      this.isAvailable = false;
      return;
    }

    this.isLoading = true;
    this.reservationService.checkAvailability(
      this.roomId,
      this.checkIn,
      this.checkOut
    ).subscribe({
      next: (available) => {
        this.isAvailable = available;
        this.isLoading = false;
        if (available) {
          this.calculateTotal();
          this.errorMessage = '';
        } else {
          this.errorMessage = 'This room is not available for the selected dates. Please choose different dates.';
        }
      },
      error: (error) => {
        console.error('Error checking availability:', error);
        this.isLoading = false;
        this.isAvailable = false;
        this.errorMessage = 'Failed to check availability. Please try again.';
      }
    });
  }

  calculateTotal(): void {
    if (this.checkIn && this.checkOut) {
      const checkInDate = new Date(this.checkIn);
      const checkOutDate = new Date(this.checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (this.nights > 0) {
        this.subtotal = this.nights * (this.room.price || 0);
        this.tax = this.subtotal * 0.10;
        this.serviceFee = this.subtotal * 0.03;
        this.totalAmount = this.subtotal + this.tax + this.serviceFee;
      }
    }
  }

  createReservation(): void {
    if (!this.guestName || !this.email || !this.checkIn || !this.checkOut) {
      alert('Please fill in all required fields.');
      return;
    }

    this.reservationService.checkAvailability(
      this.roomId,
      this.checkIn,
      this.checkOut
    ).subscribe({
      next: (available) => {
        if (!available) {
          alert('Sorry, this room is no longer available for the selected dates.');
          return;
        }

        const reservation = {
          room: { id: this.roomId },
          checkInDate: this.checkIn,
          checkOutDate: this.checkOut,
          nights: this.nights,
          guests: this.guests || 1,
          totalPrice: this.totalAmount,
          specialRequests: this.notes,
          status: 'PENDING',
          guestName: this.guestName,
          email: this.email,
          address: this.address,
          phone: this.phone,
          dob: this.dob,
          idType: this.idType,
          idNumber: this.idNumber
        };

        this.reservationService.createReservation(reservation).subscribe({
          next: (response) => {
            if (this.paymentMethod === 'online') {
              this.processPayment(response.id);
            } else {
              this.confirmReservation(response.id);
            }
          },
          error: (error) => {
            console.error('Error creating reservation:', error);
            alert('Failed to create reservation: ' + (error.error?.message || 'Please try again.'));
          }
        });
      },
      error: (error) => {
        console.error('Error checking availability:', error);
        alert('Please check your dates and try again.');
      }
    });
  }

  processPayment(reservationId: number): void {
    if (!this.cardNumber || !this.expiryDate || !this.cvv || !this.cardholderName) {
      alert('Please fill in all card details.');
      return;
    }

    const paymentData = {
      reservationId: reservationId,
      amount: this.totalAmount,
      cardNumber: this.cardNumber,
      expiryDate: this.expiryDate,
      cvv: this.cvv,
      cardholderName: this.cardholderName
    };

    this.reservationService.processPayment(paymentData).subscribe({
      next: (response) => {
        alert(`Payment of $${this.totalAmount.toFixed(2)} successful!`);
        this.router.navigate(['/reservations']);
      },
      error: (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed: ' + (error.error?.message || 'Please try again.'));
      }
    });
  }

  confirmReservation(reservationId: number): void {
    this.reservationService.confirmReservation(reservationId).subscribe({
      next: () => {
        alert(`Reservation confirmed! Total: $${this.totalAmount.toFixed(2)} (Pay at hotel)`);
        this.router.navigate(['/reservations']);
      },
      error: (error) => {
        console.error('Error confirming reservation:', error);
        alert('Failed to confirm reservation. Please try again.');
      }
    });
  }

  onDateChange(): void {
    if (this.checkIn && this.checkOut) {
      const checkInDate = new Date(this.checkIn);
      const checkOutDate = new Date(this.checkOut);

      if (checkOutDate <= checkInDate) {
        this.errorMessage = 'Check-out date must be after check-in date.';
        this.isAvailable = false;
        return;
      }

      this.errorMessage = '';
      this.checkAvailability();
    }
  }

  isFormValid(): boolean {
    return !!(this.guestName && this.email && this.checkIn && this.checkOut && this.isAvailable);
  }
}
