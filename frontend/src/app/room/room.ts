import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { RouterModule } from '@angular/router';
import { RoomService, Room } from '../services/room.service';
import { HotelService, Hotel } from '../services/hotel.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Footer,
    Header
  ],
  templateUrl: './room.html',
  styleUrl: './room.css',
})
export class RoomComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  hotels: Hotel[] = [];

  searchQuery: string = '';
  selectedCity: string = '';
  minGuests: number = 1;
  maxPrice: number = 1000;
  amenityFilter: string = '';
  extendableOnly: boolean = false;
  sortBy: string = 'featured';

  cities: string[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef  // ✅ Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('RoomComponent initialized!');
    this.loadRooms();
    this.loadHotels();
  }

  loadRooms(): void {
    console.log('Loading rooms...');
    this.isLoading = true;
    this.errorMessage = '';

    this.roomService.getActiveRooms().subscribe({
      next: (data) => {
        console.log('Rooms loaded:', data);
        this.rooms = (data || []).map(room => ({
          ...room,
          isExtendable: room.isExtendable === true,
          extendable: room.extendable === true || room.isExtendable === true,
          price: room.price || 0,
          capacity: room.capacity || 1,
          roomNumber: room.roomNumber || room.number || 'N/A',
          isActive: room.isActive === true
        }));
        this.filteredRooms = this.rooms;
        this.extractCities();
        this.isLoading = false;

        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.errorMessage = 'Failed to load rooms. Please try again.';
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  loadHotels(): void {
    this.hotelService.getActiveHotels().subscribe({
      next: (data) => {
        this.hotels = (data || []).map(hotel => ({
          ...hotel,
          isActive: hotel.isActive === true
        }));
        console.log('Hotels loaded for room lookup:', this.hotels.length);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
      }
    });
  }

  extractCities(): void {
    const citySet = new Set<string>();
    this.rooms.forEach(room => {
      if (room.hotelId) {
        const hotel = this.hotels.find(h => h.id === room.hotelId);
        if (hotel?.cityName) {
          citySet.add(hotel.cityName);
        } else if (hotel?.city) {
          citySet.add(hotel.city);
        }
      }
    });
    this.cities = Array.from(citySet).sort();
    console.log('📊 Cities extracted:', this.cities);

    this.cdr.detectChanges();
  }

  getHotelName(hotelId?: number): string {
    if (!hotelId) return 'Hotel';
    const hotel = this.hotels.find(h => h.id === hotelId);
    return hotel?.name || 'Hotel';
  }

  getHotelCity(hotelId?: number): string {
    if (!hotelId) return 'Unknown City';
    const hotel = this.hotels.find(h => h.id === hotelId);
    return hotel?.cityName || hotel?.city || 'Unknown City';
  }

  getHotelImage(hotelId?: number): string {
    if (!hotelId) return '';
    const hotel = this.hotels.find(h => h.id === hotelId);
    return hotel?.imageUrl || '';
  }

  applyFilters(): void {
    console.log('🔍 Applying filters...');

    this.filteredRooms = this.rooms.filter(room => {
      let matches: boolean = true;

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        const hotelName = this.getHotelName(room.hotelId).toLowerCase();
        const hotelCity = this.getHotelCity(room.hotelId).toLowerCase();
        const roomNumber = (room.roomNumber || '').toLowerCase();
        const roomType = (room.roomTypeName || '').toLowerCase();

        const searchMatch =
          hotelName.includes(query) ||
          hotelCity.includes(query) ||
          roomNumber.includes(query) ||
          roomType.includes(query);

        matches = matches && searchMatch;
      }

      if (this.selectedCity) {
        const hotelCity = this.getHotelCity(room.hotelId);
        matches = matches && (hotelCity === this.selectedCity);
      }

      if (this.minGuests > 1) {
        const roomCapacity = room.capacity || 0;
        matches = matches && (roomCapacity >= this.minGuests);
      }

      if (this.maxPrice < 1000) {
        const roomPrice = room.price || 0;
        matches = matches && (roomPrice <= this.maxPrice);
      }

      if (this.extendableOnly) {
        const isExtendable = room.isExtendable === true || room.extendable === true;
        matches = matches && isExtendable;
      }

      return matches;
    });

    this.sortRooms();

    this.cdr.detectChanges();

    console.log('📊 Filtered rooms:', this.filteredRooms.length);
  }

  sortRooms(): void {
    switch(this.sortBy) {
      case 'price-low':
        this.filteredRooms.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        this.filteredRooms.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default: // featured
        break;
    }

    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCity = '';
    this.minGuests = 1;
    this.maxPrice = 1000;
    this.amenityFilter = '';
    this.extendableOnly = false;
    this.sortBy = 'featured';
    this.filteredRooms = this.rooms;

    this.cdr.detectChanges();

    console.log('Filters reset');
  }

  onSortChange(): void {
    this.sortRooms();
  }

  getImageUrl(room: Room): string {
    if (room.imageUrl) {
      return room.imageUrl;
    }
    if (room.hotelId) {
      const hotelImage = this.getHotelImage(room.hotelId);
      if (hotelImage) return hotelImage;
    }
    const fallbacks = [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-c53cd426d116?auto=format&fit=crop&w=800&q=80'
    ];
    const index = (room.id || 0) % fallbacks.length;
    return fallbacks[index];
  }

  getRoomTitle(room: Room): string {
    const hotelName = this.getHotelName(room.hotelId);
    return `${hotelName} - Room #${room.roomNumber}`;
  }

  getAmenitiesString(room: Room): string {
    if (room.amenities) return room.amenities;
    const defaultAmenities = ['WiFi', 'AC', 'Smart TV'];
    return defaultAmenities.join(', ');
  }

  viewRoomDetails(roomId?: number): void {
    if (roomId) {
      console.log('View room details for:', roomId);
    }
  }
}
