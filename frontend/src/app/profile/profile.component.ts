import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    memberSince: '2025',
    tier: 'Gold Status',
    points: '12,450',
    phone: '+1 (555) 123-4567',
    address: '123 Maple Street, Toronto, ON'
  };
}
