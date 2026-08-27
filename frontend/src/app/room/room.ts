import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
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
  selectedHotelId: number | null = null;
  selectedHotelName: string = '';
  minGuests: number = 1;
  maxPrice: number = 1000;
  amenityFilter: string = '';
  extendableOnly: boolean = false;
  sortBy: string = 'featured';

  cities: string[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // Amenity filter properties
  amenitySearchQuery: string = '';
  selectedAmenities: string[] = [];
  availableAmenities: string[] = [];
  amenityCounts: { [key: string]: number } = {};

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('RoomComponent initialized!');

    this.route.queryParams.subscribe(params => {
      const hotelId = params['hotel'];
      if (hotelId) {
        this.selectedHotelId = parseInt(hotelId);
        console.log('Filtering by hotel ID:', this.selectedHotelId);
      }
      this.loadRooms();
      this.loadHotels();
    });
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

        if (this.selectedHotelId) {
          this.filteredRooms = this.rooms.filter(room =>
            room.hotelId === this.selectedHotelId
          );

          const hotel = this.hotels.find(h => h.id === this.selectedHotelId);
          if (hotel) {
            this.selectedHotelName = hotel.name || 'Hotel';
          }
        } else {
          this.filteredRooms = this.rooms;
        }

        this.extractCities();
        this.extractAmenities();
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

        if (this.selectedHotelId) {
          const hotel = this.hotels.find(h => h.id === this.selectedHotelId);
          if (hotel) {
            this.selectedHotelName = hotel.name || 'Hotel';
          }
        }

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
    console.log('Cities extracted:', this.cities);
    this.cdr.detectChanges();
  }

  extractAmenities(): void {
    const amenitySet = new Set<string>();
    const counts: { [key: string]: number } = {};

    this.rooms.forEach(room => {
      const amenities = this.getRoomAmenities(room);
      amenities.forEach(amenity => {
        if (amenity && amenity.trim()) {
          const trimmed = amenity.trim();
          amenitySet.add(trimmed);
          counts[trimmed] = (counts[trimmed] || 0) + 1;
        }
      });
    });

    this.availableAmenities = Array.from(amenitySet).sort();
    this.amenityCounts = counts;

    console.log('Available amenities extracted:', this.availableAmenities);
    console.log('Amenity counts:', this.amenityCounts);
    this.cdr.detectChanges();
  }

  getRoomAmenities(room: Room): string[] {
    const amenities: string[] = [];

    if (room.amenities) {
      if (typeof room.amenities === 'string') {
        const parts = room.amenities.split(/[,;|]/).map(a => a.trim());
        amenities.push(...parts);
      } else if (Array.isArray(room.amenities)) {
        const amenityArray = room.amenities as any[];
        amenityArray.forEach((a: any) => {
          if (typeof a === 'string') {
            amenities.push(a);
          } else if (a && typeof a === 'object') {
            const name = a.name || a.amenityName || a.amenity || '';
            if (name) amenities.push(name);
          }
        });
      }
    }

    if ((room as any).roomAmenityIds && Array.isArray((room as any).roomAmenityIds)) {
      (room as any).roomAmenityIds.forEach((item: any) => {
        if (typeof item === 'string') {
          amenities.push(item);
        } else if (item && typeof item === 'object') {
          const name = item.name || item.amenityName || item.amenity || '';
          if (name) amenities.push(name);
        }
      });
    }

    if ((room as any).roomAmenities && Array.isArray((room as any).roomAmenities)) {
      (room as any).roomAmenities.forEach((item: any) => {
        if (typeof item === 'string') {
          amenities.push(item);
        } else if (item && typeof item === 'object') {
          const name = item.name || item.amenityName || item.amenity || '';
          if (name) amenities.push(name);
        }
      });
    }

    const uniqueAmenities = [...new Set(amenities)].filter(a => a && a.trim());

    if (uniqueAmenities.length === 0) {
      if (room.roomTypeName) {
        const typeBasedAmenities = this.getAmenitiesByRoomType(room.roomTypeName);
        if (typeBasedAmenities.length > 0) {
          return typeBasedAmenities;
        }
      }
      return ['WiFi', 'Air Conditioning', 'Smart TV'];
    }

    return uniqueAmenities;
  }

  getAmenitiesByRoomType(roomType: string): string[] {
    const typeMap: { [key: string]: string[] } = {
      'Deluxe': ['WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Balcony'],
      'Suite': ['WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Balcony', 'Kitchenette', 'Spa Access'],
      'Standard': ['WiFi', 'Air Conditioning', 'Smart TV'],
      'Premium': ['WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Sea View'],
      'Family': ['WiFi', 'Air Conditioning', 'Smart TV', 'Kitchenette', 'Pool Access']
    };

    const lowerType = roomType.toLowerCase();
    for (const [key, value] of Object.entries(typeMap)) {
      if (lowerType.includes(key.toLowerCase())) {
        return value;
      }
    }
    return [];
  }

  getAmenityCount(amenity: string): number {
    return this.amenityCounts[amenity] || 0;
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

  clearHotelFilter(): void {
    this.selectedHotelId = null;
    this.selectedHotelName = '';
    this.router.navigate(['/room']);
    this.filteredRooms = this.rooms;
    this.cdr.detectChanges();
  }

  applyFilters(): void {
    console.log('Applying filters...');

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

      if (this.selectedHotelId) {
        matches = matches && (room.hotelId === this.selectedHotelId);
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

      if (this.selectedAmenities.length > 0) {
        const roomAmenities = this.getRoomAmenities(room);
        const hasAllAmenities = this.selectedAmenities.every(selectedAmenity =>
          roomAmenities.some(roomAmenity =>
            roomAmenity.toLowerCase().trim() === selectedAmenity.toLowerCase().trim()
          )
        );
        matches = matches && hasAllAmenities;
      }

      if (this.amenitySearchQuery.trim()) {
        const query = this.amenitySearchQuery.toLowerCase().trim();
        const roomAmenities = this.getRoomAmenities(room);
        const hasMatchingAmenity = roomAmenities.some(amenity =>
          amenity.toLowerCase().includes(query)
        );
        matches = matches && hasMatchingAmenity;
      }

      return matches;
    });

    this.sortRooms();
    this.cdr.detectChanges();
    console.log('Filtered rooms:', this.filteredRooms.length);
  }

  toggleAmenity(amenity: string): void {
    const index = this.selectedAmenities.indexOf(amenity);
    if (index > -1) {
      this.selectedAmenities.splice(index, 1);
    } else {
      this.selectedAmenities.push(amenity);
    }
    this.applyFilters();
  }

  removeAmenity(amenity: string): void {
    this.selectedAmenities = this.selectedAmenities.filter(a => a !== amenity);
    this.applyFilters();
  }

  sortRooms(): void {
    switch(this.sortBy) {
      case 'price-low':
        this.filteredRooms.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        this.filteredRooms.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCity = '';
    this.selectedHotelId = null;
    this.selectedHotelName = '';
    this.minGuests = 1;
    this.maxPrice = 1000;
    this.amenityFilter = '';
    this.amenitySearchQuery = '';
    this.selectedAmenities = [];
    this.extendableOnly = false;
    this.sortBy = 'featured';
    this.filteredRooms = this.rooms;
    this.router.navigate(['/room']);
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
    const amenities = this.getRoomAmenities(room);
    return amenities.join(', ');
  }

  viewRoomDetails(roomId?: number): void {
    if (roomId) {
      console.log('Viewing room details for ID:', roomId);
      this.router.navigate(['/room-details'], {
        queryParams: { id: roomId }
      });
    } else {
      console.warn('No room ID provided');
    }
  }
}
