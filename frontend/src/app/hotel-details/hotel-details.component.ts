import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HotelService, Hotel } from '../services/hotel.service';
import { RoomService, Room } from '../services/room.service';
import {Service, ServiceService} from '../services/service.service';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, RouterModule],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | null = null;
  hotelId: number | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  rooms: Room[] = [];
  services: Service[] = [];

  constructor(
    private hotelService: HotelService,
    private roomService: RoomService,
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('HotelDetailsComponent initialized!');

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.hotelId = parseInt(id);
        console.log('Loading hotel with ID:', this.hotelId);
        this.loadHotelDetails();
        this.loadHotelRooms();
        this.loadHotelServices();
      } else {
        this.errorMessage = 'No hotel ID provided';
        this.isLoading = false;
      }
    });
  }

  loadHotelDetails(): void {
    if (!this.hotelId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.hotelService.getHotelById(this.hotelId).subscribe({
      next: (data) => {
        console.log('Hotel details loaded:', data);
        this.hotel = {
          ...data,
          isActive: data.isActive === true,
          name: data.name || 'Unnamed Hotel',
          cityName: data.cityName || data.city || 'Unknown City',
          rating: data.rating || 0,
          chain: data.chain || '',
          address: data.address || '',
          imageUrl: data.imageUrl || '',
          description: data.description || '',
          checkIn: data.checkIn || '15:00',
          checkOut: data.checkOut || '11:00',
          hotelAmenities: data.hotelAmenities || []
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading hotel details:', err);
        this.errorMessage = 'Failed to load hotel details. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadHotelRooms(): void {
    if (!this.hotelId) return;

    this.roomService.getRoomsByHotel(this.hotelId).subscribe({
      next: (data) => {
        console.log('Rooms for hotel:', data);
        this.rooms = (data || []).map(room => ({
          ...room,
          isExtendable: room.isExtendable === true,
          extendable: room.extendable === true || room.isExtendable === true,
          price: room.price || 0,
          capacity: room.capacity || 1,
          roomNumber: room.roomNumber || room.number || 'N/A',
          isActive: room.isActive === true
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading rooms for hotel:', err);
      }
    });
  }

  loadHotelServices(): void {
    if (!this.hotelId) return;

    this.serviceService.getServicesByHotel(this.hotelId).subscribe({
      next: (data) => {
        console.log('Services for hotel:', data);
        this.services = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading services for hotel:', err);
      }
    });
  }

  getCityName(hotel: Hotel): string {
    return hotel.cityName || hotel.city || 'Unknown City';
  }

  getImageUrl(hotel: Hotel): string {
    if (hotel.imageUrl) {
      return hotel.imageUrl;
    }
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  }

  getStarRating(rating?: number): string {
    if (!rating) return '';
    return '★'.repeat(Math.min(rating, 5)) + '☆'.repeat(Math.max(0, 5 - rating));
  }

  viewRooms(): void {
    if (this.hotelId) {
      this.router.navigate(['/room'], {
        queryParams: { hotel: this.hotelId }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/hotels']);
  }

  copyAddress(): void {
    if (this.hotel?.address) {
      navigator.clipboard.writeText(this.hotel.address).then(() => {
        console.log('Address copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy address:', err);
      });
    }
  }
}
