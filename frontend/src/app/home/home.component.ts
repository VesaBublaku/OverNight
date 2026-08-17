import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  today = new Date();
  checkInDate: Date = new Date();
  checkOutDate: Date = new Date(new Date().setDate(new Date().getDate() + 1));

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
}
