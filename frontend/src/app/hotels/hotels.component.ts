import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent {
  hotels = [
    {
      title: 'Delta Coventry Suites',
      city: 'OTTAWA',
      address: '200 Coventry Rd, Ottawa, ON K1K 4S3',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Delta Dalhousie',
      city: 'OTTAWA',
      address: '350 Dalhousie St, Ottawa, ON K1N 7E9',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Delta Lyon North',
      city: 'OTTAWA',
      address: '101 Lyon St. N, Ottawa, ON K1R 5T9',
      image: 'https://images.unsplash.com/photo-1542314831-c53cd426d116?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Delta Albert',
      city: 'OTTAWA',
      address: '150 Albert St, Ottawa, ON K1P 5G2',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    }
  ];
}
