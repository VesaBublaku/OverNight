import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { ReservationService } from '../services/reservation.service';
import { RoomService } from '../services/room.service';
import { HotelService } from '../services/hotel.service';
import { PaymentService } from '../services/payment.service';
import { StripeService } from '../services/stripe.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, RouterLink],
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit, OnDestroy {
  paymentMethod: string = 'online';
  roomId: number = 0;

  stripe: Stripe | null = null;
  private elements: any;
  private cardElement: any;
  clientSecret: string | null = null;
  paymentIntentId: string | null = null;
  isProcessingPayment: boolean = false;

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
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const publishableKey = 'pk_test_51U9rbMEiJBXU7FwCIFD0LN0xKqRn9LHvE6eKDkP5pohVb1d06s7M4KNbej1oJEWLknxMrP3FlUR2YyXxvXbRpMOv008nbBC5BD';
      this.stripe = await loadStripe(publishableKey);
      console.log('Stripe loaded successfully');

      if (this.stripe) {
        this.elements = this.stripe.elements();
        this.cardElement = this.elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
          },
          hidePostalCode: true,
        });
        this.cardElement.mount('#card-element');

        this.cardElement.on('change', (event: any) => {
          const displayError = document.getElementById('card-errors');
          if (displayError) {
            if (event.error) {
              displayError.textContent = event.error.message;
            } else {
              displayError.textContent = '';
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to load Stripe:', error);
    }

    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('currentUser');

    console.log('BOOKING PAGE AUTH CHECK');
    console.log('Token exists:', !!token);
    console.log('User JSON exists:', !!userJson);

    if (!token) {
      console.warn('User not logged in!');
    }

    if (userJson) {
      try {
        const currentUser = JSON.parse(userJson);
        this.email = currentUser.email || '';
        this.guestName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
        this.phone = currentUser.phone || '';
        console.log('Loaded user:', currentUser);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

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
        console.warn('No room ID in URL, using mock data');
        this.loadMockRoom();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
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
        console.log('Hotel loaded:', hotel);
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

    const userJson = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');

    console.log('CREATE RESERVATION DEBUG');
    console.log('User JSON:', userJson);
    console.log('Token exists:', !!token);

    if (!token) {
      alert('Please login first to make a reservation.');
      this.router.navigate(['/login']);
      this.isLoading = false;
      return;
    }

    let userId: number | null = null;
    let userEmail = this.email;

    if (userJson) {
      try {
        const currentUser = JSON.parse(userJson);
        userId = currentUser.id;
        userEmail = currentUser.email || this.email;
        console.log('User ID found:', userId);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

    if (!userId && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.id;
        console.log('User ID from token:', userId);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }

    if (!userId) {
      alert('Please login first to make a reservation.');
      this.router.navigate(['/login']);
      this.isLoading = false;
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
          user: { id: userId },
          room: { id: this.roomId },
          checkInDate: this.checkIn,
          checkOutDate: this.checkOut,
          nights: this.nights,
          guests: this.guests || 1,
          totalPrice: this.totalAmount,
          specialRequests: this.notes,
          status: 'UPCOMING',
          guestName: this.guestName,
          email: userEmail,
          address: this.address,
          phone: this.phone,
          dob: this.dob,
          idType: this.idType,
          idNumber: this.idNumber
        };

        console.log('Sending reservation with user ID:', userId);

        this.reservationService.createReservation(reservation).subscribe({
          next: (response) => {
            console.log('Reservation created:', response);

            if (this.paymentMethod === 'online') {
              this.processStripePayment(response.id, this.totalAmount);
            } else {
              this.confirmReservation(response.id);
            }
          },
          error: (error) => {
            console.error('Error creating reservation:', error);
            const errorMsg = error.error?.message || error.message || 'Please try again.';
            alert('Failed to create reservation: ' + errorMsg);
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

  async processStripePayment(reservationId: number, amount: number): Promise<void> {
    this.isProcessingPayment = true;

    try {
      this.stripeService.createPaymentIntent(reservationId, amount, 'usd').subscribe({
        next: async (response) => {
          this.clientSecret = response.clientSecret;
          this.paymentIntentId = response.paymentIntentId;

          if (this.stripe && this.clientSecret && this.cardElement) {
            const { error, paymentIntent } = await this.stripe.confirmCardPayment(
              this.clientSecret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    name: this.guestName,
                    email: this.email,
                  },
                },
              }
            );

            if (error) {
              console.error('Payment error:', error);
              alert('Payment failed: ' + error.message);
              this.isProcessingPayment = false;
              this.isLoading = false;
            } else if (paymentIntent) {
              if (paymentIntent.status === 'succeeded') {
                console.log('Payment successful, saving to database...');

                if (this.paymentIntentId) {
                  this.stripeService.confirmPayment(this.paymentIntentId, reservationId).subscribe({
                    next: (savedPayment) => {
                      console.log('Payment saved to database:', savedPayment);
                      alert(`Payment of $${amount.toFixed(2)} successful!`);
                      this.confirmReservation(reservationId);
                    },
                    error: (saveError) => {
                      console.error('Error saving payment:', saveError);
                      alert('Payment was successful but failed to save. Please contact support.');
                      this.confirmReservation(reservationId);
                    }
                  });
                } else {
                  console.error('PaymentIntentId is null!');
                  alert('Payment successful but unable to save. Please contact support.');
                  this.confirmReservation(reservationId);
                }
              } else {
                alert('Payment was not completed. Please try again.');
                this.isProcessingPayment = false;
                this.isLoading = false;
              }
            }
          }
        },
        error: (error) => {
          console.error('Error creating payment intent:', error);
          alert('Payment initialization failed. Please try again.');
          this.isProcessingPayment = false;
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      this.isProcessingPayment = false;
      this.isLoading = false;
    }
  }

  confirmReservation(reservationId: number): void {
    // ✅ If payment method is 'hotel', create a hotel payment record
    if (this.paymentMethod === 'hotel') {
      // Create hotel payment record
      this.paymentService.processHotelPayment(reservationId).subscribe({
        next: (payment) => {
          console.log('✅ Hotel payment record created:', payment);

          // Then confirm the reservation
          this.reservationService.confirmReservation(reservationId).subscribe({
            next: () => {
              alert(`✅ Reservation confirmed! Total: $${this.totalAmount.toFixed(2)} (Pay at hotel)`);
              this.isLoading = false;
              this.isProcessingPayment = false;
              this.router.navigate(['/reservations']);
            },
            error: (error) => {
              console.error('❌ Error confirming reservation:', error);
              alert('Reservation created but confirmation failed. Please contact support.');
              this.isLoading = false;
              this.isProcessingPayment = false;
            }
          });
        },
        error: (error) => {
          console.error('❌ Error creating hotel payment:', error);
          // Still confirm the reservation even if payment creation fails
          this.reservationService.confirmReservation(reservationId).subscribe({
            next: () => {
              alert(`✅ Reservation confirmed! Total: $${this.totalAmount.toFixed(2)} (Pay at hotel)`);
              this.isLoading = false;
              this.isProcessingPayment = false;
              this.router.navigate(['/reservations']);
            },
            error: (error) => {
              console.error('❌ Error confirming reservation:', error);
              alert('Reservation created but confirmation failed. Please contact support.');
              this.isLoading = false;
              this.isProcessingPayment = false;
            }
          });
        }
      });
    } else {
      // ✅ For online payments, just confirm the reservation
      this.reservationService.confirmReservation(reservationId).subscribe({
        next: () => {
          alert(`✅ Reservation confirmed! Total: $${this.totalAmount.toFixed(2)}`);
          this.isLoading = false;
          this.isProcessingPayment = false;
          this.router.navigate(['/reservations']);
        },
        error: (error) => {
          console.error('❌ Error confirming reservation:', error);
          alert('Reservation created but confirmation failed. Please contact support.');
          this.isLoading = false;
          this.isProcessingPayment = false;
        }
      });
    }
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
