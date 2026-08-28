import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RoomService, Room } from '../services/room.service';
import { HotelService, Hotel } from '../services/hotel.service';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterModule],
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {
  room: Room | null = null;
  hotel: Hotel | null = null;
  roomId: number | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('RoomDetailsComponent initialized!');

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      console.log('Received room ID:', id);

      if (id) {
        this.roomId = parseInt(id);
        console.log('Loading room with ID:', this.roomId);
        this.loadRoomDetails();
      } else {
        this.errorMessage = 'No room ID provided';
        this.isLoading = false;
        console.warn('No room ID in URL');
      }
    });
  }

  loadRoomDetails(): void {
    if (!this.roomId) {
      console.warn('No room ID to load');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    console.log('Loading room details for ID:', this.roomId);

    this.roomService.getRoomById(this.roomId).subscribe({
      next: (data) => {
        console.log('Room details loaded:', data);
        this.room = {
          ...data,
          isExtendable: data.isExtendable === true,
          extendable: data.extendable === true || data.isExtendable === true,
          price: data.price || 0,
          capacity: data.capacity || 1,
          roomNumber: data.roomNumber || data.number || 'N/A',
          isActive: data.isActive === true
        };

        if (this.room.hotelId) {
          this.loadHotelDetails(this.room.hotelId);
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading room details:', err);
        this.errorMessage = 'Failed to load room details. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadHotelDetails(hotelId: number): void {
    this.hotelService.getHotelById(hotelId).subscribe({
      next: (data) => {
        console.log('Hotel details loaded:', data);
        this.hotel = {
          ...data,
          isActive: data.isActive === true,
          name: data.name || 'Unnamed Hotel',
          cityName: data.cityName || data.city || 'Unknown City'
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading hotel details:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getImageUrl(room: Room): string {
    if (room.imageUrl) {
      return room.imageUrl;
    }
    const fallbacks = [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80'
    ];
    const index = (room.id || 0) % fallbacks.length;
    return fallbacks[index];
  }

  getHotelName(): string {
    if (this.hotel?.name) {
      return this.hotel.name;
    }
    return 'Hotel';
  }

  getCityName(): string {
    if (this.hotel?.cityName) {
      return this.hotel.cityName;
    }
    if (this.hotel?.city) {
      return this.hotel.city;
    }
    return 'Unknown City';
  }

  getRoomNumber(): string {
    return this.room?.roomNumber || this.room?.number || 'N/A';
  }

  getPrice(): string {
    if (this.room?.price) {
      return `$${this.room.price.toFixed(2)}`;
    }
    return '$0.00';
  }

  isExtendable(): boolean {
    return this.room?.isExtendable === true || this.room?.extendable === true;
  }

  getAmenities(): string[] {
    if (!this.room) return ['WiFi', 'Air Conditioning', 'Smart TV'];

    const amenities = this.room.amenities || this.room.roomAmenities;

    if (!amenities) {
      return this.getDefaultAmenities();
    }

    if (Array.isArray(amenities)) {
      return amenities.map((a: any) => {
        if (typeof a === 'string') return a;
        return a.name || a.amenityName || '';
      }).filter(Boolean);
    }

    if (typeof amenities === 'string') {
      return amenities.split(/[,;|]/).map((a: string) => a.trim()).filter(Boolean);
    }

    return ['WiFi', 'Air Conditioning', 'Smart TV'];
  }

  getDefaultAmenities(): string[] {
    const roomType = this.room?.roomTypeName || this.room?.roomType?.name || '';
    const defaultAmenities: { [key: string]: string[] } = {
      'Deluxe': ['WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Balcony'],
      'Suite': ['WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Balcony', 'Kitchenette', 'Spa Access'],
      'Standard': ['WiFi', 'Air Conditioning', 'Smart TV'],
      'Premium': ['WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Sea View'],
      'Family': ['WiFi', 'Air Conditioning', 'Smart TV', 'Kitchenette', 'Pool Access']
    };

    for (const [key, value] of Object.entries(defaultAmenities)) {
      if (roomType.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return ['WiFi', 'Air Conditioning', 'Smart TV'];
  }
  goBack(): void {
    this.router.navigate(['/room']);
  }

  viewHotel(): void {
    if (this.room?.hotelId) {
      this.router.navigate(['/hotel-details'], {
        queryParams: { id: this.room.hotelId }
      });
    } else if (this.hotel?.id) {
      this.router.navigate(['/hotel-details'], {
        queryParams: { id: this.hotel.id }
      });
    } else {
      this.router.navigate(['/hotels']);
    }
  }

  bookRoom(): void {
    console.log('Booking room with ID:', this.room?.id);
    console.log('Full room data:', this.room);

    if (this.room?.id) {
      localStorage.setItem('bookingRoom', JSON.stringify(this.room));
      localStorage.setItem('bookingRoomId', String(this.room.id));

      this.router.navigate(['/booking'], {
        queryParams: { id: this.room.id }
      });
    } else {
      console.error('No room ID available for booking');
      alert('Cannot book this room. Please try again.');
    }
  }
}
