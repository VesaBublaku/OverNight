import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Footer} from '../footer/footer';
import {Header} from '../header/header';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    CommonModule,
    Footer,
    Header
  ],
  templateUrl: './room.html',
  styleUrl: './room.css',
})
export class Room {
  rooms = [
    {
      price: 'CA$300.86',
      city: 'St Johns',
      roomNumber: '217',
      capacity: 4,
      extendable: true,
      title: 'Marriott St Johns East',
      amenities: 'WiFi, AC, Smart TV, Work desk',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
    },
    {
      price: 'CA$306.98',
      city: 'Montreal',
      roomNumber: '138',
      capacity: 4,
      extendable: true,
      title: 'Westin Montreal Notre-Dame',
      amenities: 'WiFi, AC, Smart TV, Mini bar',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    },
    {
      price: 'CA$338.67',
      city: 'Ottawa',
      roomNumber: '220',
      capacity: 4,
      extendable: false,
      title: 'Ramada Ottawa Lyon',
      amenities: 'WiFi, AC, Smart TV, Mini bar',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      price: 'CA$345.97',
      city: 'Kanata',
      roomNumber: '231',
      capacity: 4,
      extendable: true,
      title: 'Hilton Kanata Campeau',
      amenities: 'WiFi, AC, Smart TV, Mini bar',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ];
}
