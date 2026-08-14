import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChainComponent } from './chain/chain.component';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Room } from './room/room';
import { HotelsComponent } from './hotels/hotels.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { BookingComponent } from './booking/booking.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminLoginComponent } from './admin/admin-login.component';
import { AdminShellComponent } from './admin/admin-shell.component';
import { AdminHotelsComponent } from './admin/admin-hotels.component';
import { AdminPeopleComponent } from './admin/admin-people.component';
import { adminGuard } from './admin/admin.guard';

export const routes: Routes = [
  // ── Public ──────────────────────────────────────
  { path: '', component: HomeComponent },
  { path: 'chains', component: ChainComponent },
  { path: 'hotels', component: HotelsComponent },
  { path: 'hotel-details', component: HotelDetailsComponent },
  { path: 'room', component: Room },
  { path: 'room-details', component: RoomDetailsComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'header', component: Header },
  { path: 'footer', component: Footer },

  // ── Admin ────────────────────────────────────────
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [adminGuard],
    children: [
      { path: '',        redirectTo: 'hotels', pathMatch: 'full' },
      { path: 'hotels',  component: AdminHotelsComponent },
      { path: 'people',  component: AdminPeopleComponent },
    ]
  },
];

