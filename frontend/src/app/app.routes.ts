import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChainComponent } from './chain/chain.component';
import { Header } from './header/header';
import { Footer } from './footer/footer';
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
import {StaffLoginComponent} from './staff/staff-login.component';
import {StaffShellComponent} from './staff/staff-shell.component';
import {StaffDashboardComponent} from './staff/staff';
import {staffGuard} from './staff/staff.guard';
import {StaffPaymentsComponent} from './staff/staff-payments';
import {UserLoginComponent} from './log-in/log-in';
import {UserSignupComponent} from './signup/signup';
import {RoomComponent} from './room/room';

export const routes: Routes = [
  // ── Public ──────────────────────────────────────
  { path: '', component: HomeComponent },
  { path: 'chains', component: ChainComponent },
  { path: 'hotels', component: HotelsComponent },
  { path: 'hotel-details', component: HotelDetailsComponent },
  { path: 'room', component: RoomComponent },
  { path: 'room-details', component: RoomDetailsComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'signup', component: UserSignupComponent },
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


  // ── Staff ────────────────────────────────────────
  { path: 'staff/login', component: StaffLoginComponent },
  {
    path: 'staff',
    component: StaffShellComponent,
    canActivate: [staffGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StaffDashboardComponent },
      { path: 'payments', component: StaffPaymentsComponent },
    ]
  },
];

