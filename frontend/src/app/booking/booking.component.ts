import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { ReservationService } from '../services/reservation.service';
import { RoomService } from '../services/room.service';
import { HotelService } from '../services/hotel.service';

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
    extendable: false,
    capacity: 1,
    amenities: [],
    roomTypeName: ''
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
    private roomService: RoomService,
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      console.log('Booking page - Room ID from URL:', id);

      if (id) {
        this.roomId = parseInt(id);

        const cachedRoom = localStorage.getItem('bookingRoom');
        const cachedRoomId = localStorage.getItem('bookingRoomId');

        if (cachedRoom && cachedRoomId && parseInt(cachedRoomId) === this.roomId) {
          try {
            const roomData = JSON.parse(cachedRoom);
            console.log('Using cached room data:', roomData);
            this.room = {
              id: roomData.id,
              number: roomData.roomNumber || roomData.number || 'N/A',
              price: roomData.price || 0,
              image: roomData.imageUrl || '',
              city: roomData.hotelCity || roomData.city || 'City',
              hotelName: roomData.hotelName || roomData.hotel?.name || 'Hotel',
              extendable: roomData.isExtendable || roomData.extendable || false,
              capacity: roomData.capacity || 1,
              amenities: roomData.amenities || roomData.roomAmenities || [],
              roomTypeName: roomData.roomTypeName || roomData.roomType?.name || ''
            };
            console.log('Room from cache:', this.room);
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
          } catch (e) {
            console.error('Error parsing cached room:', e);
          }
        }

        this.loadRoomDetails();
        this.loadUnavailableDates();
      } else {
        console.warn('⚠No room ID in URL, using mock data');
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
    console.log('Loading room with ID:', this.roomId);

    this.roomService.getRoomById(this.roomId).subscribe({
      next: (data) => {
        console.log('Room data loaded:', data);

        if (!data || !data.id) {
          console.error('Invalid room data received:', data);
          this.errorMessage = 'Invalid room data received';
          this.isLoading = false;
          this.createFallbackRoom();
          this.cdr.detectChanges();
          return;
        }

        this.room = {
          id: data.id,
          number: data.roomNumber || data.number || 'N/A',
          price: data.price || 0,
          image: data.imageUrl || '',
          city: data.hotelCity || data.hotel?.cityName || data.hotel?.city || 'City',
          hotelName: data.hotelName || data.hotel?.name || 'Hotel',
          extendable: data.isExtendable || data.extendable || false,
          capacity: data.capacity || 1,
          amenities: data.amenities || data.roomAmenities || [],
          roomTypeName: data.roomTypeName || data.roomType?.name || ''
        };

        console.log('Room mapped for display:', this.room);

        localStorage.setItem('bookingRoom', JSON.stringify(this.room));
        localStorage.setItem('bookingRoomId', String(this.room.id));

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading room:', error);
        console.error('Error status:', error.status);

        this.errorMessage = `Failed to load room details. Status: ${error.status}`;
        this.isLoading = false;
        this.createFallbackRoom();
        this.cdr.detectChanges();
      }
    });
  }

  createFallbackRoom(): void {
    console.log('Creating fallback room with ID:', this.roomId);
    this.room = {
      id: this.roomId,
      number: String(this.roomId),
      price: 200,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80',
      city: 'City',
      hotelName: `Hotel ${this.roomId}`,
      extendable: false,
      capacity: 2,
      amenities: ['WiFi', 'Air Conditioning', 'Smart TV'],
      roomTypeName: 'Standard'
    };
    console.log('Fallback room created:', this.room);
  }

  loadHotelInfo(hotelId: number): void {
    this.hotelService.getHotelById(hotelId).subscribe({
      next: (hotel) => {
        console.log('🏨 Hotel loaded:', hotel);
        this.room.hotelName = hotel.name || 'Hotel';
        this.room.city = hotel.cityName || hotel.city || 'City';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading hotel:', error);
        this.room.hotelName = 'Hotel';
        this.room.city = 'City';
        this.cdr.detectChanges();
      }
    });
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
      extendable: true,
      capacity: 2,
      amenities: ['WiFi', 'Air Conditioning', 'Smart TV', 'Work Desk'],
      roomTypeName: 'Deluxe'
    };
    this.isLoading = false;
    this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error checking availability:', error);
        this.isLoading = false;
        this.isAvailable = false;
        this.errorMessage = 'Failed to check availability. Please try again.';
        this.cdr.detectChanges();
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
      this.cdr.detectChanges();
    }
  }

  createReservation(): void {
    if (!this.guestName || !this.email || !this.checkIn || !this.checkOut) {
      alert('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;
    this.reservationService.checkAvailability(
      this.roomId,
      this.checkIn,
      this.checkOut
    ).subscribe({
      next: (available) => {
        if (!available) {
          alert('Sorry, this room is no longer available for the selected dates.');
          this.isLoading = false;
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
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error checking availability:', error);
        alert('Please check your dates and try again.');
        this.isLoading = false;
      }
    });
  }

  processPayment(reservationId: number): void {
    if (!this.cardNumber || !this.expiryDate || !this.cvv || !this.cardholderName) {
      alert('Please fill in all card details.');
      this.isLoading = false;
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
      next: () => {
        alert(`Payment of $${this.totalAmount.toFixed(2)} successful!`);
        this.isLoading = false;
        this.router.navigate(['/reservations']);
      },
      error: (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed: ' + (error.error?.message || 'Please try again.'));
        this.isLoading = false;
      }
    });
  }

  confirmReservation(reservationId: number): void {
    this.reservationService.confirmReservation(reservationId).subscribe({
      next: () => {
        alert(`Reservation confirmed! Total: $${this.totalAmount.toFixed(2)} (Pay at hotel)`);
        this.isLoading = false;
        this.router.navigate(['/reservations']);
      },
      error: (error) => {
        console.error('Error confirming reservation:', error);
        alert('Failed to confirm reservation. Please try again.');
        this.isLoading = false;
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

  getRoomAmenities(): string[] {
    if (!this.room) return ['WiFi', 'Air Conditioning', 'Smart TV'];

    if (this.room.amenities) {
      if (typeof this.room.amenities === 'string') {
        return this.room.amenities.split(/[,;|]/).map((a: string) => a.trim()).filter(Boolean);
      }
      if (Array.isArray(this.room.amenities)) {
        return this.room.amenities.map((a: any) => typeof a === 'string' ? a : a.name || a.amenityName || '').filter(Boolean);
      }
    }

    const defaultAmenities: { [key: string]: string[] } = {
      'Deluxe': ['WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Balcony'],
      'Suite': ['WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Balcony', 'Kitchenette', 'Spa Access'],
      'Standard': ['WiFi', 'Air Conditioning', 'Smart TV'],
      'Premium': ['WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Sea View'],
      'Family': ['WiFi', 'Air Conditioning', 'Smart TV', 'Kitchenette', 'Pool Access']
    };

    const roomType = this.room.roomTypeName || this.room.roomType?.name || '';
    for (const [key, value] of Object.entries(defaultAmenities)) {
      if (roomType.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return ['WiFi', 'Air Conditioning', 'Smart TV'];
  }

  getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80';
  }

  goBack(): void {
    this.router.navigate(['/room']);
  }
}
