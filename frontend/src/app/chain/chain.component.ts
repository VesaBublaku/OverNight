import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-chain',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './chain.component.html',
  styleUrls: ['./chain.component.css']
})
export class ChainComponent {
  chains = [
    { name: 'Delta', logo: 'Δ', image: 'https://logo.clearbit.com/deltahotels.com', hotels: 4 },
    { name: 'Fairmont Hotels', logo: 'F', image: 'https://logo.clearbit.com/fairmont.com', hotels: 4 },
    { name: 'Sheraton', logo: 'S', image: 'https://logo.clearbit.com/sheraton.com', hotels: 5 },
    { name: 'Hyatt Place', logo: 'H', image: 'https://logo.clearbit.com/hyatt.com', hotels: 1 },
    { name: 'Ramada', logo: 'R', image: 'https://logo.clearbit.com/ramada.com', hotels: 3 }
  ];
}
