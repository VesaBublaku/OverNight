import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';
import { HotelService, Hotel } from '../services/hotel.service';

interface DisplayHotel extends Hotel {
  isActive: boolean;
  hotelAmenities: any[];
}

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, RouterModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: DisplayHotel[] = [];
  filteredHotels: DisplayHotel[] = [];
  searchQuery: string = '';
  selectedCity: string = '';
  cities: string[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef ,
  ) {}

  ngOnInit(): void {
    console.log('HotelsComponent initialized!');
    this.loadHotels();
  }

  loadHotels(): void {
    console.log('🔄 Loading hotels...');
    this.isLoading = true;
    this.errorMessage = '';

    this.hotelService.getActiveHotels().subscribe({
      next: (data) => {
        console.log('Hotels loaded:', data);

        this.hotels = (data || []).map(hotel => ({
          ...hotel,
          isActive: hotel.isActive === true,
          name: hotel.name || 'Unnamed Hotel',
          cityName: hotel.cityName || hotel.city || 'Unknown City',
          rating: hotel.rating || 0,
          chain: hotel.chain || '',
          address: hotel.address || '',
          imageUrl: hotel.imageUrl || '',
          description: hotel.description || '',
          checkIn: hotel.checkIn || '15:00',
          checkOut: hotel.checkOut || '11:00',
          hotelAmenities: hotel.hotelAmenities || []
        }));

        this.filteredHotels = this.hotels;
        this.extractCities();
        this.isLoading = false;

        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error(' Error loading hotels:', err);
        this.errorMessage = 'Failed to load hotels. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  extractCities(): void {
    const citySet = new Set<string>();
    this.hotels.forEach(hotel => {
      if (hotel.cityName) {
        citySet.add(hotel.cityName);
      } else if (hotel.city) {
        citySet.add(hotel.city);
      }
    });
    this.cities = Array.from(citySet).sort();
    console.log('Cities extracted:', this.cities);
  }

  searchHotels(): void {
    if (!this.searchQuery.trim() && !this.selectedCity) {
      this.filteredHotels = this.hotels;
      return;
    }

    this.filteredHotels = this.hotels.filter(hotel => {
      let matches = true;

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        matches = matches && !!(
          hotel.name?.toLowerCase().includes(query) ||
          hotel.cityName?.toLowerCase().includes(query) ||
          hotel.city?.toLowerCase().includes(query) ||
          hotel.address?.toLowerCase().includes(query) ||
          hotel.chain?.toLowerCase().includes(query)
        );
      }

      if (this.selectedCity) {
        matches = matches && !!(
          hotel.cityName === this.selectedCity ||
          hotel.city === this.selectedCity
        );
      }

      return matches;
    });
  }

  onCityChange(): void {
    this.searchHotels();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCity = '';
    this.filteredHotels = this.hotels;
  }

  getImageUrl(hotel: DisplayHotel): string {
    if (hotel.imageUrl) {
      return hotel.imageUrl;
    }
    const fallbacks = [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-c53cd426d116?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ];
    const index = (hotel.id || 0) % fallbacks.length;
    return fallbacks[index];
  }

  getCityName(hotel: DisplayHotel): string {
    return hotel.cityName || hotel.city || 'Unknown City';
  }

  getStarRating(rating?: number): string {
    if (!rating) return '';
    return '★'.repeat(Math.min(rating, 5)) + '☆'.repeat(Math.max(0, 5 - rating));
  }

  viewHotelDetails(hotelId?: number): void {
    if (hotelId) {
      console.log('View hotel details for:', hotelId);
    }
  }

  viewRooms(hotelId?: number): void {
    if (hotelId) {
      console.log('View rooms for hotel:', hotelId);
    }
  }
}
