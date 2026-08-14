import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent {
  upcomingReservations = [
    {
      id: 'RES-9284',
      hotelName: 'Marriott St Johns East',
      city: 'St Johns',
      room: '217',
      checkIn: 'Oct 15, 2026',
      checkOut: 'Oct 18, 2026',
      guests: 2,
      total: 'CA$902.58',
      status: 'Confirmed',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
    }
  ];

  pastReservations = [
    {
      id: 'RES-2104',
      hotelName: 'Delta Coventry Suites',
      city: 'Ottawa',
      room: '122',
      checkIn: 'Jul 10, 2026',
      checkOut: 'Jul 12, 2026',
      guests: 1,
      total: 'CA$826.42',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'RES-1033',
      hotelName: 'Westin Montreal Notre-Dame',
      city: 'Montreal',
      room: '138',
      checkIn: 'Mar 05, 2026',
      checkOut: 'Mar 08, 2026',
      guests: 2,
      total: 'CA$920.94',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    }
  ];
}
