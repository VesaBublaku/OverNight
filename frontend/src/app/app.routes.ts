import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChainComponent } from './chain/chain.component';
import {Header} from './header/header';
import {Footer} from './footer/footer';
import {Room} from './room/room';
import {HotelsComponent} from './hotels/hotels.component';
import {HotelDetailsComponent} from './hotel-details/hotel-details.component';
import {RoomDetailsComponent} from './room-details/room-details.component';
import {BookingComponent} from './booking/booking.component';
import {ReservationsComponent} from './reservations/reservations.component';
import {ProfileComponent} from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chains', component: ChainComponent },
  { path: 'hotels', component: HotelsComponent },
  { path: 'hotel-details', component: HotelDetailsComponent },
  { path: 'room-details', component: RoomDetailsComponent },
  { path: 'room', component: Room },
  { path: 'booking', component: BookingComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'header', component: Header },
  { path: 'footer', component: Footer },
];

