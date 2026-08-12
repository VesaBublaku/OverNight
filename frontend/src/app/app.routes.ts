import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChainComponent } from './chain/chain.component';
import {Header} from './header/header';
import {Footer} from './footer/footer';
import {Room} from './room/room';
import {HotelsComponent} from './hotels/hotels.component';
import {HotelDetailsComponent} from './hotel-details/hotel-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chains', component: ChainComponent },
  { path: 'hotels', component: HotelsComponent },
  { path: 'hotel-details', component: HotelDetailsComponent },
  { path: 'header', component: Header },
  { path: 'footer', component: Footer },
  { path: 'room', component: Room },
];
