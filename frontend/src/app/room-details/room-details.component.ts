import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterModule],
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent {
  room = {
    number: '122',
    hotelName: 'Delta Coventry Suites',
    city: 'Ottawa',
    price: 'CA$413.21',
    capacity: 4,
    extendable: true,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1920&q=80'
  };
}
