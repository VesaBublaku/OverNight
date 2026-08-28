import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Header, Footer],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  today = new Date();
  checkInDate: Date = new Date();
  checkOutDate: Date = new Date(new Date().setDate(new Date().getDate() + 1));
  searchCity: string = '';
  guestCount: number = 2;
  availableCities: string[] = [];
  filteredCities: string[] = [];
  showCitySuggestions: boolean = false;

  constructor(
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCities();
  }

  get minCheckOutDate(): Date {
    return new Date(this.checkInDate.getTime() + 24 * 60 * 60 * 1000);
  }

  onCheckInChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.checkInDate = new Date(input.value);
      if (this.checkOutDate <= this.checkInDate) {
        this.checkOutDate = new Date(this.checkInDate.getTime() + 24 * 60 * 60 * 1000);
      }
    }
  }

  onCheckOutChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.checkOutDate = new Date(input.value);
    }
  }

  loadCities(): void {
    this.roomService.getCities().subscribe({
      next: (cities) => {
        this.availableCities = cities || [];
        console.log('Cities loaded:', this.availableCities);
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        this.availableCities = ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'New York'];
      }
    });
  }

  onCityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase().trim();

    if (value.length > 0) {
      this.filteredCities = this.availableCities.filter(city =>
        city.toLowerCase().includes(value)
      );
      this.showCitySuggestions = this.filteredCities.length > 0;
    } else {
      this.filteredCities = [];
      this.showCitySuggestions = false;
    }
  }

  selectCity(city: string): void {
    this.searchCity = city;
    this.showCitySuggestions = false;
  }

  onGuestsChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.guestCount = parseInt(input.value) || 1;
  }

  searchRooms(): void {
    const checkIn = this.formatDate(this.checkInDate);
    const checkOut = this.formatDate(this.checkOutDate);

    console.log('🔍 Searching rooms with:', {
      city: this.searchCity,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: this.guestCount
    });

    this.router.navigate(['/room'], {
      queryParams: {
        city: this.searchCity || undefined,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: this.guestCount
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  protected readonly setTimeout = setTimeout;
}
