import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterModule],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent {
  // Mock data for the view
  hotel = {
    name: 'Delta Coventry Suites',
    city: 'Ottawa',
    chain: 'Delta',
    email: 'DELTA-1@OUTLOOK.CA',
    rating: '2/5',
    address: '200 Coventry Rd, Ottawa, ON K1K 4S3',
    description: 'A calm, elevated stay experience — refined spaces, thoughtful service, and details designed for comfort. Browse rooms and reserve in minutes.',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1920&q=80',
    checkIn: '3:00 PM',
    checkOut: '11:00 AM'
  };
}
